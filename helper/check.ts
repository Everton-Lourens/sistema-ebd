import { THIS_CLASSES_TODAY } from "@/constants/ClassName";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToday } from "./format";

/**
 * Percorre todas as turmas e zera somente os registros
 * cuja data não seja igual à data de hoje.
 *
 * @param {Record<string, Array<Object>>} classesList
 * @returns {Record<string, Array<Object>>}
 */
export function checkClasses(classesList: Record<string, { [key: string]: any; bible: boolean; magazine: boolean; present: boolean; }[]>) {
    const today = getToday();
    let dataAluno;

    Object.fromEntries(
        Object.entries(classesList).map(([turma, alunos]) => [
            turma,
            (alunos || []).map(aluno => {
                dataAluno = (aluno.date ?? '').toString().split('T')[0];
                if (dataAluno === today) return aluno;
                return {
                    ...aluno,
                    bible: false,
                    magazine: false,
                    present: false,
                    date: today,
                };
            }),
        ])
    );
    if (dataAluno === today)
        AsyncStorage.setItem(`${THIS_CLASSES_TODAY}_${getToday()}`, JSON.stringify(classesList))

    return classesList
}

/* ---------- Exemplo rápido ---------- */
// const limpo = limparSeNaoHoje(seuObjeto);
// console.log(JSON.stringify(limpo, null, 2));



function getYesterday() {
    const date = new Date();
    date.setDate(date.getDate() - 1); // Subtrai 1 dia
    return date.toISOString().split('T')[0]; // Retorna AAAA-MM-DD
}
