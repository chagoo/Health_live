import type {
  BloodPressureRecord,
  BodyCompositionRecord,
  GlucoseRecord,
  LipidRecord,
  MetricKind,
  MetricRecordMap,
} from './metrics';

export type ThresholdConfig = {
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  glucose: {
    value: number;
  };
  lipids: {
    totalCholesterol: number;
    ldl: number;
    triglycerides: number;
  };
  bodyComposition: {
    bmiHigh: number;
    bmiLow: number;
  };
};

export const DEFAULT_THRESHOLDS: ThresholdConfig = {
  bloodPressure: {
    systolic: 140,
    diastolic: 90,
  },
  glucose: {
    value: 140,
  },
  lipids: {
    totalCholesterol: 200,
    ldl: 130,
    triglycerides: 150,
  },
  bodyComposition: {
    bmiHigh: 30,
    bmiLow: 18.5,
  },
};

export type MetricAlert = {
  recordId: string;
  message: string;
};

type Evaluator<T> = (record: T) => string[];

type EvaluatorMap = {
  [K in MetricKind]: Evaluator<MetricRecordMap[K]>;
};

const bloodPressureEvaluator: Evaluator<BloodPressureRecord> = record => {
  const alerts: string[] = [];
  if (record.systolic >= DEFAULT_THRESHOLDS.bloodPressure.systolic) {
    alerts.push('La presión sistólica supera el objetivo recomendado.');
  }
  if (record.diastolic >= DEFAULT_THRESHOLDS.bloodPressure.diastolic) {
    alerts.push('La presión diastólica supera el objetivo recomendado.');
  }
  return alerts;
};

const glucoseEvaluator: Evaluator<GlucoseRecord> = record =>
  record.value >= DEFAULT_THRESHOLDS.glucose.value
    ? [`El nivel de glucosa (${record.value} mg/dL) requiere seguimiento.`]
    : [];

const lipidEvaluator: Evaluator<LipidRecord> = record => {
  const alerts: string[] = [];
  if (record.totalCholesterol >= DEFAULT_THRESHOLDS.lipids.totalCholesterol) {
    alerts.push('El colesterol total se encuentra por encima del umbral.');
  }
  if (record.ldl >= DEFAULT_THRESHOLDS.lipids.ldl) {
    alerts.push('El LDL supera el valor objetivo.');
  }
  if (record.triglycerides >= DEFAULT_THRESHOLDS.lipids.triglycerides) {
    alerts.push('Los triglicéridos están elevados.');
  }
  return alerts;
};

const bodyEvaluator: Evaluator<BodyCompositionRecord> = record => {
  if (record.bmi >= DEFAULT_THRESHOLDS.bodyComposition.bmiHigh) {
    return ['El IMC indica obesidad, considere consultar con su especialista.'];
  }
  if (record.bmi < DEFAULT_THRESHOLDS.bodyComposition.bmiLow) {
    return ['El IMC indica bajo peso, revise su plan nutricional.'];
  }
  return [];
};

const evaluators: EvaluatorMap = {
  bloodPressure: bloodPressureEvaluator,
  glucose: glucoseEvaluator,
  lipids: lipidEvaluator,
  bodyComposition: bodyEvaluator,
};

export const buildAlerts = <K extends MetricKind>(
  metric: K,
  records: MetricRecordMap[K][],
): MetricAlert[] =>
  records
    .map(record => ({
      recordId: record.id,
      messages: evaluators[metric](record),
    }))
    .filter(item => item.messages.length > 0)
    .flatMap(item =>
      item.messages.map(message => ({recordId: item.recordId, message})),
    );
