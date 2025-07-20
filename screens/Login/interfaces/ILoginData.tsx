import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  login: Yup.string()
    .required("Login é obrigatório")
    .min(3, "Login precisa ter ao menos 3 caracteres")
    .max(50, "Login precisa ter no máximo 50 caracteres"),
  password: Yup.string().required("Senha é obrigatória"),
});

export type ILoginData = Yup.InferType<typeof loginSchema>;
