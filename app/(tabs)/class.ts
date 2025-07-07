import AsyncStorage from '@react-native-async-storage/async-storage';

const CLASSES = 'classes';
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
        };
        return AsyncStorage.getItem(CLASSES).then((classes) => {
            try {
                let classesList =
                    classes !== null && typeof classes === 'string' ? JSON.parse(classes) : {};
                if (!classesList.hasOwnProperty(newStudent.className)) {
                    classesList[newStudent.className] = [];
                }
                classesList[newStudent.className].push(newStudentData);
                AsyncStorage.setItem(CLASSES, JSON.stringify(classesList))
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

    static getAllStudents(className = '') {
        if (!className)
            throw new Error("Nome da turma é obrigatório.");
        return AsyncStorage.getItem(CLASSES)
            .then((classes) => {
                const classesList =
                    classes !== null && typeof classes === 'string' ? JSON.parse(classes) : classes ?? {};
                if (className) {
                    return className in classesList ? { [className]: classesList[className] } : {};
                }
                return classesList;
            })
    }

    static getStudentsInClass(className = '', id = '') {
        if (!className)
            throw new Error("Nome do aluno e turma obrigatórios.");
        return AsyncStorage.getItem(CLASSES)
            .then((classes) => {
                const classesList = classes !== null ? JSON.parse(classes) : [];
                return classesList[className] || [];
            })
    }

    static editStudentInClass(newStudent: MyClass) {
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
        return AsyncStorage.getItem(CLASSES)
            .then((classes) => {
                const classesList = classes !== null ? JSON.parse(classes) : {};
                if (classesList[newStudent.className] && classesList[newStudent.className][newStudent.id]) {
                    classesList[newStudent.className][newStudent.id] = editStudentData;
                }
                AsyncStorage.setItem(CLASSES, JSON.stringify(classesList));
                return classesList;
            })
    }

    static countStudentsInClass(className: string, date = new Date().toISOString().split('T')[0]) {
        if (!className) {
            throw new Error("Turma é obrigatória.");
        }
        return AsyncStorage.getItem(`${date}_${className}_students`)
            .then((students) => {
                const studentsList = students !== null ? JSON.parse(students) : [];
                return studentsList.length;
            });
    }

    static removeStudentInClass(newStudent: MyClass) {
        if (!newStudent.name || !newStudent.className) {
            throw new Error("Nome do aluno e turma obrigatórios.");
        }
        return AsyncStorage.getItem(CLASSES)
            .then((classes) => {
                return classes !== null ? JSON.parse(classes) : [];
            })
            .then((classesList) => {
                delete classesList[newStudent.className];
                AsyncStorage.setItem(CLASSES, JSON.stringify(classesList));
                return classesList
            });
    }

    static countStudents(className: string) {
        if (!className) {
            throw new Error("Turma é obrigatória.");
        }
        return AsyncStorage.getItem(`${new Date().toISOString().split('T')[0]}_${className}_students`)
            .then((students) => {
                const studentsList = students !== null ? JSON.parse(students) : [];
                return studentsList.length;
            });
    }

    static editClassDetail(className: string, classDetail: any) {
        if (!className || !classDetail) {
            throw new Error("Turma e detalhes obrigatórios.");
        }
    }

    static getClassDetail(className: string) {
        if (!className) {
            throw new Error("Turma é obrigatória.");
        }
        return AsyncStorage.getItem(`${new Date().toISOString().split('T')[0]}_${className}_details`)
            .then((classDetail) => {
                return classDetail !== null ? JSON.parse(classDetail) : {};
            });
    }

    static callStudents(className: string, newCall: any) {
        if (!className || !newCall)
            throw new Error("Turma e presença obrigatórias.");

        this.storageCall(className, newCall);

        return AsyncStorage.getItem(CLASSES)
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
                AsyncStorage.setItem(CLASSES, JSON.stringify(studentsList));
                return studentsList
            });
    }

    private static storageCall(className: string, newCall: any) {
        try {
            AsyncStorage.getItem(`call_${new Date().toISOString().split('T')[0]}_${className}`)
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
                            date: new Date().toISOString().split('T')[0],
                        }
                        callsList.push(call);
                    }
                    AsyncStorage.setItem(`call_${new Date().toISOString().split('T')[0]}_${className}`, JSON.stringify(callsList));
                })
        } catch (error) { console.trace(error) }
    }

    static removeStudent(id: string) {
        if (!id) {
            throw new Error("ID do aluno é obrigatório.");
        }
        const students = AsyncStorage.getItem(`students_${student.className}`);
        const studentsList = students ? JSON.parse(students) : [];
        const index = studentsList.findIndex((student: MyClass) => student.id === id);
        if (index > -1) {
            studentsList.splice(index, 1);
            AsyncStorage.setItem(`students_${student.className}`, JSON.stringify(studentsList));
        }
    }
    static getStudent(id: string) {
        if (!id) {
            throw new Error("ID do aluno é obrigatório.");
        }
        const student = AsyncStorage.getItem(`student_${id}`);
        return student ? JSON.parse(student) :
            {
                id: '',
                name: '',
                className: ''
            };
    }
}

