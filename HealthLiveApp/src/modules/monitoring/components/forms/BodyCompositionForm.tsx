import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {BodyCompositionRecord} from '../../domain';
import FormField from './FormField';

type BodyCompositionFormProps = {
  onSubmit: (record: Omit<BodyCompositionRecord, 'id'>) => Promise<void> | void;
};

type Errors = Partial<Record<'weightKg' | 'heightCm' | 'recordedAt', string>>;

const today = () => new Date().toISOString().slice(0, 10);

const BodyCompositionForm: React.FC<BodyCompositionFormProps> = ({onSubmit}) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [recordedAt, setRecordedAt] = useState(today());
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = () => {
    const nextErrors: Errors = {};
    const weightValue = Number(weight);
    const heightValue = Number(height);

    if (!weight || Number.isNaN(weightValue) || weightValue <= 0) {
      nextErrors.weightKg = 'Introduce un peso válido en kilogramos.';
    }
    if (!height || Number.isNaN(heightValue) || heightValue <= 0) {
      nextErrors.heightCm = 'Introduce una estatura válida en centímetros.';
    }

    const parsedDate = Date.parse(recordedAt);
    if (!recordedAt || Number.isNaN(parsedDate) || parsedDate > Date.now()) {
      nextErrors.recordedAt = 'La fecha debe tener el formato AAAA-MM-DD y no ser futura.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const heightMeters = heightValue / 100;
    const bmi = Number((weightValue / (heightMeters * heightMeters)).toFixed(2));

    onSubmit({
      weightKg: weightValue,
      heightCm: heightValue,
      bmi,
      recordedAt: new Date(recordedAt).toISOString(),
    });

    setErrors({});
    setWeight('');
    setHeight('');
    setRecordedAt(today());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Nuevo registro</Text>
      <View style={styles.row}>
        <View style={[styles.fieldWrapper, styles.fieldSpacing]}>
          <FormField
            label="Peso (kg)"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
            error={errors.weightKg}
            accessibilityLabel="Peso en kilogramos"
          />
        </View>
        <View style={styles.fieldWrapper}>
          <FormField
            label="Estatura (cm)"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
            error={errors.heightCm}
            accessibilityLabel="Estatura en centímetros"
          />
        </View>
      </View>
      <FormField
        label="Fecha"
        placeholder="AAAA-MM-DD"
        value={recordedAt}
        onChangeText={setRecordedAt}
        error={errors.recordedAt}
        accessibilityLabel="Fecha del registro de peso"
      />
      <Text style={styles.submit} onPress={handleSubmit} accessibilityRole="button">
        Guardar registro
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#dcfce7',
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
    color: '#15803d',
    fontWeight: '600',
  },
});

export default BodyCompositionForm;
