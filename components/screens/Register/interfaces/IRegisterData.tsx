import * as Yup from "yup";

export const registerSchema = Yup.object().shape({
  name: Yup.string()
    .required("Nome é obrigatório")
    .min(3, "Nome precisa ter ao menos 3 caracteres")
    .max(50, "Nome precisa ter no máximo 50 caracteres"),
  studentClass: Yup.string().required("Classe é obrigatória"),
});

export type IRegisterData = Yup.InferType<typeof registerSchema>;
