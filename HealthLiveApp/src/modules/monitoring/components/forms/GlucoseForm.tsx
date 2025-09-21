import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {GlucoseContext, GlucoseRecord} from '../../domain';
import FormField from './FormField';

type GlucoseFormProps = {
  onSubmit: (record: Omit<GlucoseRecord, 'id'>) => Promise<void> | void;
};

type Errors = Partial<Record<'value' | 'recordedAt', string>>;

const contexts: GlucoseContext[] = ['ayunas', 'postprandial', 'aleatoria'];
const today = () => new Date().toISOString().slice(0, 10);

const GlucoseForm: React.FC<GlucoseFormProps> = ({onSubmit}) => {
  const [value, setValue] = useState('');
  const [context, setContext] = useState<GlucoseContext>('ayunas');
  const [recordedAt, setRecordedAt] = useState(today());
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = () => {
    const nextErrors: Errors = {};
    const parsedValue = Number(value);

    if (!value || Number.isNaN(parsedValue) || parsedValue <= 0) {
      nextErrors.value = 'Introduce un valor de glucosa válido.';
    }

    const parsedDate = Date.parse(recordedAt);
    if (!recordedAt || Number.isNaN(parsedDate) || parsedDate > Date.now()) {
      nextErrors.recordedAt = 'La fecha debe tener el formato AAAA-MM-DD y no ser futura.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      value: parsedValue,
      context,
      recordedAt: new Date(recordedAt).toISOString(),
    });

    setErrors({});
    setValue('');
    setRecordedAt(today());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Nuevo registro</Text>
      <FormField
        label="Glucosa (mg/dL)"
        keyboardType="numeric"
        value={value}
        onChangeText={setValue}
        error={errors.value}
        accessibilityLabel="Valor de glucosa"
      />
      <View style={styles.contextRow}>
        {contexts.map(item => (
          <Pressable
            key={item}
            style={[styles.contextChip, item === context && styles.contextChipActive]}
            onPress={() => setContext(item)}
            accessibilityRole="button"
          >
            <Text style={[styles.contextText, item === context && styles.contextTextActive]}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
      <FormField
        label="Fecha"
        placeholder="AAAA-MM-DD"
        value={recordedAt}
        onChangeText={setRecordedAt}
        error={errors.recordedAt}
        accessibilityLabel="Fecha del registro de glucosa"
      />
      <Text style={styles.submit} onPress={handleSubmit} accessibilityRole="button">
        Guardar registro
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fef9c3',
    borderRadius: 16,
    padding: 16,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  contextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  contextChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
    backgroundColor: '#fff7ed',
  },
  contextChipActive: {
    backgroundColor: '#facc15',
    borderColor: '#eab308',
  },
  contextText: {
    fontSize: 13,
    color: '#92400e',
    textTransform: 'capitalize',
  },
  contextTextActive: {
    color: '#78350f',
    fontWeight: '600',
  },
  submit: {
    marginTop: 8,
    color: '#ca8a04',
    fontWeight: '600',
  },
});

export default GlucoseForm;
