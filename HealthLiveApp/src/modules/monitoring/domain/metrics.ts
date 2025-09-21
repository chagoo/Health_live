export type MetricKind =
  | 'bloodPressure'
  | 'glucose'
  | 'lipids'
  | 'bodyComposition';

export type MetricRecordBase = {
  id: string;
  recordedAt: string; // ISO string
  note?: string;
};

export type BloodPressureRecord = MetricRecordBase & {
  systolic: number;
  diastolic: number;
  pulse?: number;
};

export type GlucoseContext = 'ayunas' | 'postprandial' | 'aleatoria';

export type GlucoseRecord = MetricRecordBase & {
  value: number;
  context: GlucoseContext;
};

export type LipidRecord = MetricRecordBase & {
  totalCholesterol: number;
  hdl: number;
  ldl: number;
  triglycerides: number;
};

export type BodyCompositionRecord = MetricRecordBase & {
  weightKg: number;
  heightCm: number;
  bmi: number;
};

export type MetricRecordMap = {
  bloodPressure: BloodPressureRecord;
  glucose: GlucoseRecord;
  lipids: LipidRecord;
  bodyComposition: BodyCompositionRecord;
};

export const METRIC_STORAGE_KEYS: Record<MetricKind, string> = {
  bloodPressure: '@healthlive/metrics/blood-pressure',
  glucose: '@healthlive/metrics/glucose',
  lipids: '@healthlive/metrics/lipids',
  bodyComposition: '@healthlive/metrics/body-composition',
};

export const createMetricId = () => `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

export const sortByDate = <T extends MetricRecordBase>(records: T[]): T[] =>
  [...records].sort((a, b) =>
    new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
  );
