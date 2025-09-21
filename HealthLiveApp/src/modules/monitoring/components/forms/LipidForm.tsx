import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {LipidRecord} from '../../domain';
import FormField from './FormField';

type LipidFormProps = {
  onSubmit: (record: Omit<LipidRecord, 'id'>) => Promise<void> | void;
};

type Errors = Partial<
  Record<'totalCholesterol' | 'hdl' | 'ldl' | 'triglycerides' | 'recordedAt', string>
>;

const today = () => new Date().toISOString().slice(0, 10);

const LipidForm: React.FC<LipidFormProps> = ({onSubmit}) => {
  const [totalCholesterol, setTotalCholesterol] = useState('');
  const [hdl, setHdl] = useState('');
  const [ldl, setLdl] = useState('');
  const [triglycerides, setTriglycerides] = useState('');
  const [recordedAt, setRecordedAt] = useState(today());
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = () => {
    const nextErrors: Errors = {};

    const total = Number(totalCholesterol);
    const hdlValue = Number(hdl);
    const ldlValue = Number(ldl);
    const trigValue = Number(triglycerides);

    if (!total || Number.isNaN(total) || total <= 0) {
      nextErrors.totalCholesterol = 'Introduce un valor válido de colesterol total.';
    }
    if (!hdl || Number.isNaN(hdlValue) || hdlValue <= 0) {
      nextErrors.hdl = 'Introduce un valor válido de HDL.';
    }
    if (!ldl || Number.isNaN(ldlValue) || ldlValue <= 0) {
      nextErrors.ldl = 'Introduce un valor válido de LDL.';
    }
    if (!triglycerides || Number.isNaN(trigValue) || trigValue <= 0) {
      nextErrors.triglycerides = 'Introduce un valor válido de triglicéridos.';
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
      totalCholesterol: total,
      hdl: hdlValue,
      ldl: ldlValue,
      triglycerides: trigValue,
      recordedAt: new Date(recordedAt).toISOString(),
    });

    setErrors({});
    setTotalCholesterol('');
    setHdl('');
    setLdl('');
    setTriglycerides('');
    setRecordedAt(today());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Nuevo registro</Text>
      <View style={styles.row}>
        <View style={[styles.fieldWrapper, styles.fieldSpacing]}>
          <FormField
            label="Total"
            keyboardType="numeric"
            value={totalCholesterol}
            onChangeText={setTotalCholesterol}
            error={errors.totalCholesterol}
            accessibilityLabel="Colesterol total"
          />
        </View>
        <View style={styles.fieldWrapper}>
          <FormField
            label="HDL"
            keyboardType="numeric"
            value={hdl}
            onChangeText={setHdl}
            error={errors.hdl}
            accessibilityLabel="HDL"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.fieldWrapper, styles.fieldSpacing]}>
          <FormField
            label="LDL"
            keyboardType="numeric"
            value={ldl}
            onChangeText={setLdl}
            error={errors.ldl}
            accessibilityLabel="LDL"
          />
        </View>
        <View style={styles.fieldWrapper}>
          <FormField
            label="Triglicéridos"
            keyboardType="numeric"
            value={triglycerides}
            onChangeText={setTriglycerides}
            error={errors.triglycerides}
            accessibilityLabel="Triglicéridos"
          />
        </View>
      </View>
      <FormField
        label="Fecha"
        placeholder="AAAA-MM-DD"
        value={recordedAt}
        onChangeText={setRecordedAt}
        error={errors.recordedAt}
        accessibilityLabel="Fecha del perfil lipídico"
      />
      <Text style={styles.submit} onPress={handleSubmit} accessibilityRole="button">
        Guardar registro
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ede9fe',
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
    color: '#6d28d9',
    fontWeight: '600',
  },
});

export default LipidForm;
