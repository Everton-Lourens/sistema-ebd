import { styles } from "@/constants/styles";
import { FormFieldProps } from "@/types/form";
import React from "react";
import { Text, TextInput, View } from "react-native";

export default function FormField({
  field,
  label,
  secureTextEntry,
  autoCapitalize,
  placeholder,
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
}: FormFieldProps) {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.input}
        value={values[field]}
        onChangeText={handleChange(field)}
        placeholder={placeholder}
        placeholderTextColor="gray"
        autoCorrect={true}
        onBlur={() => handleBlur(field)}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize || "none"}
      />

      {touched[field] && errors[field] ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errors[field]}</Text>
        </View>
      ) : null}
    </View>
  );
}
