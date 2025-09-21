import {useCallback, useEffect, useMemo, useState} from 'react';
import {createMetricId, MetricKind, MetricRecordBase, MetricRecordMap} from '../domain';
import {MonitoringRepository} from '../storage';

export type MetricRecordsHook<K extends MetricKind> = {
  records: MetricRecordMap[K][];
  loading: boolean;
  addRecord: (record: Omit<MetricRecordMap[K], 'id'>) => Promise<void>;
  refresh: () => Promise<void>;
};

export const useMetricRecords = <K extends MetricKind>(
  metric: K,
): MetricRecordsHook<K> => {
  const repository = useMemo(() => new MonitoringRepository(), []);
  const [records, setRecords] = useState<MetricRecordMap[K][]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    const stored = await repository.getRecords(metric);
    setRecords(stored);
    setLoading(false);
  }, [metric, repository]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const addRecord = useCallback(
    async (record: Omit<MetricRecordMap[K], 'id'>) => {
      const newRecord = {
        ...(record as MetricRecordBase),
        id: createMetricId(),
      } as MetricRecordMap[K];
      const updated = await repository.addRecord(metric, newRecord);
      setRecords(updated);
    },
    [metric, repository],
  );

  return {
    records,
    loading,
    addRecord,
    refresh: loadRecords,
  };
};
