import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {BloodPressureRecord} from '../../domain';
import FormField from './FormField';

type BloodPressureFormProps = {
  onSubmit: (record: Omit<BloodPressureRecord, 'id'>) => Promise<void> | void;
};

type Errors = Partial<Record<'systolic' | 'diastolic' | 'recordedAt', string>>;

const today = () => new Date().toISOString().slice(0, 10);

const BloodPressureForm: React.FC<BloodPressureFormProps> = ({onSubmit}) => {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [recordedAt, setRecordedAt] = useState(today());
  const [errors, setErrors] = useState<Errors>({});

  const isValidDate = useMemo(
    () => (value: string) => {
      if (!value) {
        return false;
      }
      const parsed = Date.parse(value);
      if (Number.isNaN(parsed)) {
        return false;
      }
      return parsed <= Date.now();
    },
    [],
  );

  const handleSubmit = () => {
    const nextErrors: Errors = {};
    const systolicValue = Number(systolic);
    const diastolicValue = Number(diastolic);

    if (!systolic || Number.isNaN(systolicValue) || systolicValue <= 0) {
      nextErrors.systolic = 'Ingresa una cifra válida para la presión sistólica.';
    }
    if (!diastolic || Number.isNaN(diastolicValue) || diastolicValue <= 0) {
      nextErrors.diastolic = 'Ingresa una cifra válida para la presión diastólica.';
    }
    if (!isValidDate(recordedAt)) {
      nextErrors.recordedAt = 'La fecha debe tener el formato AAAA-MM-DD y no ser futura.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const pulseValue = pulse ? Number(pulse) : undefined;

    onSubmit({
      systolic: systolicValue,
      diastolic: diastolicValue,
      pulse: pulseValue,
      recordedAt: new Date(recordedAt).toISOString(),
    });
    setErrors({});
    setSystolic('');
    setDiastolic('');
    setPulse('');
    setRecordedAt(today());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Nuevo registro</Text>
      <View style={styles.row}>
        <View style={[styles.fieldWrapper, styles.fieldSpacing]}>
          <FormField
            label="Sistólica (mmHg)"
            keyboardType="numeric"
            value={systolic}
            onChangeText={setSystolic}
            error={errors.systolic}
            accessibilityLabel="Valor sistólico"
          />
        </View>
        <View style={styles.fieldWrapper}>
          <FormField
            label="Diastólica (mmHg)"
            keyboardType="numeric"
            value={diastolic}
            onChangeText={setDiastolic}
            error={errors.diastolic}
            accessibilityLabel="Valor diastólico"
          />
        </View>
      </View>
      <FormField
        label="Frecuencia cardiaca (opcional)"
        keyboardType="numeric"
        value={pulse}
        onChangeText={setPulse}
        accessibilityLabel="Frecuencia cardiaca"
      />
      <FormField
        label="Fecha"
        placeholder="AAAA-MM-DD"
        value={recordedAt}
        onChangeText={setRecordedAt}
        error={errors.recordedAt}
        accessibilityLabel="Fecha del registro"
      />
      <Text style={styles.submit} onPress={handleSubmit} accessibilityRole="button">
        Guardar registro
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 16,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
  },
  fieldWrapper: {
    flex: 1,
  },
  fieldSpacing: {
    marginRight: 12,
  },
  submit: {
    marginTop: 8,
    color: '#1d4ed8',
    fontWeight: '600',
  },
});

export default BloodPressureForm;
