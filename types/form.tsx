export type FormFieldProps = {
    field: string;
    label: string;
    secureTextEntry?: boolean;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    values: { [key: string]: string };
    touched: { [key: string]: boolean };
    errors: { [key: string]: string | undefined };
    handleChange: any;
    handleBlur: (field: string) => void;
};

export interface TouchedFields {
    [field: string]: boolean;
}