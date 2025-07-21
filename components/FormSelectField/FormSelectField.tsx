import { styles } from "@/constants/styles";
import { FormSelectFieldProps } from "@/types/form";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Text, View } from "react-native";

export default function FormSelectField({
    field,
    label,
    values,
    touched,
    placeholder,
    errors,
    handleChange,
    handleBlur,
    options,
}: FormSelectFieldProps) {
    return (
        <View style={styles.formGroup}>
            <Text style={styles.label}>{label}</Text>

            <View style={styles.selectContainer}>
                <Picker
                    selectedValue={values[field]}
                    onValueChange={(itemValue) => handleChange(field)(itemValue)}
                    onBlur={() => handleBlur(field)}
                    style={{ height: 60 }} // ou use styles.input
                >
                    <Picker.Item label={placeholder || "Selecione uma opção..."} value="" />
                    {options.map((option) => (
                        <Picker.Item
                            key={option.value}
                            label={option.label}
                            value={option.value}
                        />
                    ))}
                </Picker>
            </View>


            {touched[field] && errors[field] ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errors[field]}</Text>
                </View>
            ) : null}
        </View>
    );
}
