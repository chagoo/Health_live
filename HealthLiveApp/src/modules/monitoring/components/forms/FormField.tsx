import React from 'react';
import {StyleSheet, Text, TextInput, View, TextInputProps} from 'react-native';

type FormFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

const FormField: React.FC<FormFieldProps> = ({label, error, style, ...props}) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, style, error ? styles.inputError : null]}
      placeholderTextColor="#94a3b8"
      {...props}
    />
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: '#0f172a',
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
  },
});

export default FormField;
