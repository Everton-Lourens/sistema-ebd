export type FormFieldProps = {
    field: string;
    label: string;
    secureTextEntry?: boolean;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    placeholder?: string;
    values: { [key: string]: string };
    touched: { [key: string]: boolean };
    errors: { [key: string]: string | undefined };
    handleChange: any;
    handleBlur: (field: string) => void;
};

export interface FormSelectFieldProps extends FormFieldProps {
    options: { label: string; value: string }[];
}

export interface TouchedFields {
    [field: string]: boolean;
}