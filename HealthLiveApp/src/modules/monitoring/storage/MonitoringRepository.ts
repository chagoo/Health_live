import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  METRIC_STORAGE_KEYS,
  MetricKind,
  MetricRecordBase,
  MetricRecordMap,
  sortByDate,
} from '../domain';
import SyncQueue from './SyncQueue';

type WithoutId<T extends MetricRecordBase> = Omit<T, 'id'>;

export default class MonitoringRepository {
  constructor(
    private storage = AsyncStorage,
    private syncQueue = new SyncQueue(storage),
  ) {}

  async getRecords<K extends MetricKind>(metric: K): Promise<MetricRecordMap[K][]> {
    const key = METRIC_STORAGE_KEYS[metric];
    const stored = await this.storage.getItem(key);
    if (!stored) {
      return [];
    }
    try {
      const parsed: MetricRecordMap[K][] = JSON.parse(stored);
      return sortByDate(parsed);
    } catch (error) {
      console.warn('Error parsing metric records', error);
      return [];
    }
  }

  async addRecord<K extends MetricKind>(
    metric: K,
    record: MetricRecordMap[K],
  ): Promise<MetricRecordMap[K][]> {
    const key = METRIC_STORAGE_KEYS[metric];
    const existing = await this.getRecords(metric);
    const updated = sortByDate([...existing, record]);
    await this.storage.setItem(key, JSON.stringify(updated));
    await this.syncQueue.enqueue(metric, record);
    return updated;
  }

  async persistDraft<K extends MetricKind>(
    metric: K,
    record: WithoutId<MetricRecordMap[K]>,
  ) {
    const key = `${METRIC_STORAGE_KEYS[metric]}:draft`;
    await this.storage.setItem(key, JSON.stringify(record));
  }

  async readDraft<K extends MetricKind>(
    metric: K,
  ): Promise<WithoutId<MetricRecordMap[K]> | null> {
    const key = `${METRIC_STORAGE_KEYS[metric]}:draft`;
    const stored = await this.storage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  }

  async clearDraft<K extends MetricKind>(metric: K) {
    const key = `${METRIC_STORAGE_KEYS[metric]}:draft`;
    await this.storage.removeItem(key);
  }
}

export type {WithoutId};
