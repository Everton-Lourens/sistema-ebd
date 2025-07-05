import AsyncStorage from '@react-native-async-storage/async-storage';

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

    static addStudent(student: MyClass) {
        if (!student.name || !student.className) {
            throw new Error("Nome do aluno e turma obrigatórios.");
        }
        return AsyncStorage.getItem(`${student.className}_students`)
            .then((students) => {
                return students !== null ? JSON.parse(students) : [];
            })
            .then((studentsList) => {
                studentsList.push(student);
                AsyncStorage.setItem(`${student.className}_students`, JSON.stringify(studentsList));
                AsyncStorage.setItem(`student_${student.id}`, JSON.stringify({
                    name: student.name,
                    className: student.className
                }));
                return studentsList
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
        return AsyncStorage.setItem(`${new Date().toISOString().split('T')[0]}_${className}_details`, JSON.stringify(classDetail));
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

    static editClassStudents(className: string, attendance: any) {
        if (!className || !attendance) {
            throw new Error("Turma e presença obrigatórias.");
        }
        return AsyncStorage.getItem(`${className}_students`)
            .then((students) => {
                return students !== null ? JSON.parse(students) : [];
            })
            .then((studentsList) => {
                studentsList.map((student: MyClass) => {
                    if (attendance[student.id]) {
                        student.present = attendance[student.id].present;
                        student.bible = attendance[student.id].bible;
                        student.magazine = attendance[student.id].magazine;
                    }
                });
                AsyncStorage.setItem(`${className}_students`, JSON.stringify(studentsList));
                return studentsList
            });
    }

    static removeStudent(id: string) {
        if (!id) {
            throw new Error("ID do aluno é obrigatório.");
        }
        const students = AsyncStorage.getItem(`${student.className}_students`);
        const studentsList = students ? JSON.parse(students) : [];
        const index = studentsList.findIndex((student: MyClass) => student.id === id);
        if (index > -1) {
            studentsList.splice(index, 1);
            AsyncStorage.setItem(`${student.className}_students`, JSON.stringify(studentsList));
        }
    }

    static editStudent(id: string, name: string, className: string) {
        if (!id || !name || !className) {
            throw new Error("ID, nome e turma são obrigatórios.");
        }
        const students = AsyncStorage.getItem(`${student.className}_students`);
        const studentsList = students ? JSON.parse(students) : [];
        const index = studentsList.findIndex((student: MyClass) => student.id === id);
        if (index > -1) {
            studentsList[index].name = name;
            studentsList[index].className = className;
            AsyncStorage.setItem(`${student.className}_students`, JSON.stringify(studentsList));
        }
    }

    static getStudents(className: string) {
        if (!className) {
            throw new Error("Turma é obrigatória.");
        }
        return AsyncStorage.getItem(`${className}_students`)
            .then((students) => {
                return students !== null ? JSON.parse(students) : [];
            })
            .catch((error) => {
                console.error("Erro ao obter alunos:", error);
                return [];
            });
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

