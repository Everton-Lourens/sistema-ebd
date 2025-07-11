import { CLASSES } from '@/constants/ClassName';
import { getToday } from '@/helper/format';
import { formatClass, formatGeralClass } from '@/helper/formatClass';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THIS_CLASSES_TODAY = 'classes';
const THIS_CLASSES_STORAGE = 'classes_storage';
export interface StudentData {
    id: string;
    name: string;
    className: string;
    present?: boolean;
    bible?: boolean;
    magazine?: boolean;
}

export class MyClass {
    id: string;
    name: string;
    present: boolean;
    bible: boolean;
    magazine: boolean;
    className: string;

    constructor(id: string, name: string, className: string) {
        this.id = id;
        this.name = name;
        this.className = className;
        this.present = false;
        this.bible = false;
        this.magazine = false;
    }

    static addStudentInClass(newStudent: MyClass) {
        if (!newStudent.name || !newStudent.className) {
            throw new Error("Nome do aluno e turma obrigatórios.");
        }
        const newStudentData = {
            className: newStudent.className,
            id: newStudent.id,
            name: newStudent.name,
            present: newStudent.present || false,
            bible: newStudent.bible || false,
            magazine: newStudent.magazine || false,
            date: getToday(),
        };
        return AsyncStorage.getItem(`${THIS_CLASSES_TODAY}_${getToday()}`).then((classes) => {
            try {
                let classesList =
                    classes !== null && typeof classes === 'string' ? JSON.parse(classes) : {};
                if (!classesList.hasOwnProperty(newStudent.className)) {
                    classesList[newStudent.className] = [];
                }
                classesList[newStudent.className].push(newStudentData);
                AsyncStorage.setItem(THIS_CLASSES_STORAGE, JSON.stringify(classesList))
                AsyncStorage.setItem(`${THIS_CLASSES_TODAY}_${getToday()}`, JSON.stringify(classesList))
                AsyncStorage.setItem(`student_${newStudentData.id}`, JSON.stringify({
                    name: newStudentData.name,
                    className: newStudentData.className
                }));
                return true;
            } catch (e) {
                console.log(e);
                return false;
            }
        })
            .catch((e) => {
                console.log(e);
                return e;
            })
    }

    static getAllStudentsInClass2(className = '') {
        if (!className)
            throw new Error("Nome da turma é obrigatório.");
        return AsyncStorage.getItem(`${THIS_CLASSES_TODAY}_${getToday()}`)
            .then((classes) => {
                const classesList =
                    classes !== null && typeof classes === 'string' ? JSON.parse(classes) : classes ?? {};
                if (className) {
                    return className in classesList ? { [className]: classesList[className] } : {};
                }
                return classesList;
            })
    }

    static getAllStudentsInClass(className = '') {
        if (!className)
            throw new Error("Nome da turma é obrigatório.");
        return AsyncStorage.getItem(`${THIS_CLASSES_TODAY}_${getToday()}`)
            .then((classes) => {
                const classesList =
                    classes !== null && typeof classes === 'string' ? JSON.parse(classes) : classes ?? {};
                if (Object.keys(classesList).length === 0) {
                    return AsyncStorage.getItem(THIS_CLASSES_STORAGE)
                        .then((classes) => {
                            const classesList =
                                classes !== null && typeof classes === 'string' ? JSON.parse(classes) : classes ?? {};
                            AsyncStorage.setItem(`${THIS_CLASSES_TODAY}_${getToday()}`, JSON.stringify(classesList))
                            return className in classesList ? { [className]: classesList[className] } : {};
                        })
                } else {
                    return className in classesList ? { [className]: classesList[className] } : {};
                }
            })
    }

    static getAllStudents() {
        return AsyncStorage.getItem(`${THIS_CLASSES_TODAY}_${getToday()}`)
            .then((classes) => {
                const classesList =
                    classes !== null && typeof classes === 'string' ? JSON.parse(classes) : classes ?? {};
                return Promise.all([
                    this.getClassDetail(CLASSES.CRIANCA_PEQUENA),
                    this.getClassDetail(CLASSES.CRIANCA_GRANDE),
                    this.getClassDetail(CLASSES.ADOLESCENTE),
                    this.getClassDetail(CLASSES.JOVENS),
                    this.getClassDetail(CLASSES.SENHORAS),
                    this.getClassDetail(CLASSES.SENHORES),
                ]).then((results) => {
                    try {
                        Object.entries(CLASSES).forEach(([__, _], index) => {
                            const className = results[index].details.className
                            if (classesList[className] && Array.isArray(classesList[className])) {
                                classesList[className].push(results[index].details);
                            }
                        });
                        return classesList;
                    } catch (e) {
                        console.log(e);
                    }
                });
            });
    }

    static getPartialReport() {
        return this.getAllStudents().then((res) => {
            if (!res) return [];
            return formatClass(res);
        });
    }
    static getGeralReport() {
        return this.getAllStudents().then((res) => {
            if (!res) return {};
            const partialReport = formatClass(res);
            return formatGeralClass(partialReport ? partialReport : {});
        });
    }
    static editStudentInClass(newStudent: MyClass) {
        // TODO: armazenar no STORAGE CASO ESTELA USANDO
        /*
        if (!newStudent?.className) {
            throw new Error("Turma obrigatórios.");
        }
        const editStudentData = {
            className: newStudent.className,
            id: newStudent.id,
            name: newStudent.name,
            present: newStudent.present || false,
            bible: newStudent.bible || false,
            magazine: newStudent.magazine || false,
        };
        return AsyncStorage.getItem(`${THIS_CLASSES_TODAY}_${getToday()}`)
            .then((classes) => {
                const classesList = classes !== null ? JSON.parse(classes) : {};
                if (classesList[newStudent.className] && classesList[newStudent.className][newStudent.id]) {
                    classesList[newStudent.className][newStudent.id] = editStudentData;
                }
                AsyncStorage.setItem(`${THIS_CLASSES_TODAY}_${getToday()}`, JSON.stringify(classesList));
                return classesList;
            })
    */
    }

    static countStudentsInClass(className: string, date = getToday()) {
        if (!className) {
            throw new Error("Turma é obrigatória.");
        }
        return AsyncStorage.getItem(`${date}_${className}_students`)
            .then((students) => {
                const studentsList = students !== null ? JSON.parse(students) : [];
                return studentsList.length;
            });
    }
    static countStudents(className: string) {
        if (!className) {
            throw new Error("Turma é obrigatória.");
        }
        return AsyncStorage.getItem(`${getToday()}_${className}_students`)
            .then((students) => {
                const studentsList = students !== null ? JSON.parse(students) : [];
                return studentsList.length;
            });
    }

    static editClassDetail(className: string, classDetail: any) {
        if (!className || !classDetail) {
            throw new Error("Turma e detalhes obrigatórios.");
        }
        const classDetailData = {
            guestNumber: classDetail.guestNumber,
            offersNumber: classDetail.offersNumber
        };
        return AsyncStorage.setItem(`${getToday()}_${className}_details`, JSON.stringify(classDetailData))
            .then(() => {
                return classDetail;
            });
    }

    static getClassDetail(className: string) {
        if (!className) {
            throw new Error("Turma é obrigatória.");
        }
        return AsyncStorage.getItem(`${getToday()}_${className}_details`)
            .then((classDetail) => {
                const newClassDetail = classDetail !== null ? JSON.parse(classDetail) : {};
                newClassDetail.details = {
                    className,
                    guestNumber: newClassDetail?.guestNumber || 0,
                    offersNumber: newClassDetail?.offersNumber || 'R$ 0,00'
                };
                return newClassDetail;
            });
    }

    static callStudents(className: string, newCall: any) {
        if (!className || !newCall)
            throw new Error("Turma e presença obrigatórias.");

        this.storageCall(className, newCall);

        return AsyncStorage.getItem(`${THIS_CLASSES_TODAY}_${getToday()}`)
            .then((students) => {
                const studentsList =
                    students !== null && typeof students === 'string' ? JSON.parse(students) : students ?? [];

                if (studentsList[className]) {
                    studentsList[className].map((student: any) => {
                        const id = student.id;
                        if (newCall?.id === id) {
                            student.present = newCall?.present;
                            student.bible = newCall?.bible;
                            student.magazine = newCall?.magazine;
                        }
                    });
                }
                AsyncStorage.setItem(`${THIS_CLASSES_TODAY}_${getToday()}`, JSON.stringify(studentsList));
                return studentsList
            });
    }

    private static storageCall(className: string, newCall: any) {
        try {
            AsyncStorage.getItem(`call_${getToday()}_${className}`)
                .then((calls) => {
                    const callsList = calls !== null ? JSON.parse(calls) : [];
                    const callIndex = callsList.findIndex((call) => call.id === Object.keys(newCall)[0]);
                    if (callIndex > -1) {
                        callsList[callIndex] = {
                            ...callsList[callIndex],
                            ...newCall[Object.keys(newCall)[0]],
                        }
                    } else {
                        const call = {
                            id: Object.keys(newCall)[0],
                            className,
                            name: newCall[Object.keys(newCall)[0]]?.name,
                            present: newCall[Object.keys(newCall)[0]]?.present,
                            bible: newCall[Object.keys(newCall)[0]]?.bible,
                            magazine: newCall[Object.keys(newCall)[0]]?.magazine,
                            date: getToday(),
                        }
                        callsList.push(call);
                    }
                    AsyncStorage.setItem(`call_${getToday()}_${className}`, JSON.stringify(callsList));
                })
        } catch (error) { console.trace(error) }
    }

    static removeStudent(id: string, className: string) {
        if (!id || !className) {
            throw new Error("ID e nome da turma são obrigatórios.");
        }
        try {
            AsyncStorage.getItem(`${THIS_CLASSES_TODAY}_${getToday()}`).then((students) => {
                const studentsList =
                    students !== null && typeof students === 'string' ? JSON.parse(students) : students ?? [];

                if (!studentsList[className]) {
                    console.warn(`Turma "${className}" não encontrada.`);
                    return false;
                }
                studentsList[className] = studentsList[className].filter(
                    (student: MyClass) => student.id !== id
                );
                AsyncStorage.setItem(`${THIS_CLASSES_TODAY}_${getToday()}`, JSON.stringify(studentsList));
                return true;
            });
        } catch (error) {
            console.error("Erro ao remover aluno:", error);
            return false
        }
        try {
            return AsyncStorage.getItem(THIS_CLASSES_STORAGE).then((students) => {
                const studentsList =
                    students !== null && typeof students === 'string' ? JSON.parse(students) : students ?? [];

                if (!studentsList[className]) {
                    console.warn(`Turma "${className}" não encontrada.`);
                    return false;
                }
                studentsList[className] = studentsList[className].filter(
                    (student: MyClass) => student.id !== id
                );
                AsyncStorage.setItem(THIS_CLASSES_STORAGE, JSON.stringify(studentsList));
                return true;
            });
        } catch (error) {
            console.error("Erro ao remover aluno:", error);
            return false
        }
    }

}

