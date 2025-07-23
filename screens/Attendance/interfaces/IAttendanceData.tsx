import * as Yup from "yup";

export const attendanceSchema = Yup.object().shape({
  id: Yup.string().required("ID é obrigatório"),
  present: Yup.number().required("Presença é obrigatória"),
  bible: Yup.number().required("Bíblia é obrigatória"),
  magazine: Yup.number().required("Revista é obrigatória"),
  className: Yup.string().required("Nome da classe é obrigatório"),
  enrolled: Yup.number()
    .required("Número de matriculados é obrigatório")
    .min(0, "Número de matriculados não pode ser negativo"),
  absent: Yup.number()
    .required("Número de ausentes é obrigatório")
    .min(0, "Número de ausentes não pode ser negativo"),
  visitors: Yup.number().notRequired(),
  total: Yup.number()
    .required("Total é obrigatório")
    .min(0, "Total não pode ser negativo"),
  offer: Yup.string().required("Ofertas são obrigatórias"),
  attendancePercentage: Yup.string().required("Percentual de presença é obrigatório"),
  biblePercentage: Yup.string().required("Percentual de bíblia é obrigatório"),
  magazinePercentage: Yup.string().required("Percentual de revista é obrigatório"),
});

export type IAttendanceData = Yup.InferType<typeof attendanceSchema>;
