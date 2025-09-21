import AsyncStorage from '@react-native-async-storage/async-storage';
import type {MetricKind, MetricRecordBase} from '../domain';

type SyncPayload = {
  metric: MetricKind;
  record: MetricRecordBase;
  queuedAt: string;
};

const SYNC_QUEUE_KEY = '@healthlive/metrics/sync-queue';

export default class SyncQueue {
  constructor(private storage = AsyncStorage) {}

  async enqueue(metric: MetricKind, record: MetricRecordBase) {
    const existing = await this.storage.getItem(SYNC_QUEUE_KEY);
    const payloads: SyncPayload[] = existing ? JSON.parse(existing) : [];
    const nextPayloads = [
      ...payloads,
      {
        metric,
        record,
        queuedAt: new Date().toISOString(),
      },
    ];
    await this.storage.setItem(SYNC_QUEUE_KEY, JSON.stringify(nextPayloads));
  }

  async pending(): Promise<SyncPayload[]> {
    const existing = await this.storage.getItem(SYNC_QUEUE_KEY);
    return existing ? JSON.parse(existing) : [];
  }

  async clear() {
    await this.storage.removeItem(SYNC_QUEUE_KEY);
  }
}
