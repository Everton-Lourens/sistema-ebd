import AsyncStorage from '@react-native-async-storage/async-storage';

export class Student {
    id: string;
    name: string;
    className: string;

    constructor(id: string, name: string, className: string) {
        this.id = id;
        this.name = name;
        this.className = className;
    }

    static addStudent(student: Student) {
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
                return studentsList
            });
    }

    static removeStudent(id: string) {
        if (!id) {
            throw new Error("ID do aluno é obrigatório.");
        }
        const students = AsyncStorage.getItem(`${student.className}_students`);
        const studentsList = students ? JSON.parse(students) : [];
        const index = studentsList.findIndex((student: Student) => student.id === id);
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
        const index = studentsList.findIndex((student: Student) => student.id === id);
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

    static getStudent(id: string, className: string) {
        if (!id) {
            throw new Error("ID do aluno é obrigatório.");
        }
        const students = AsyncStorage.getItem(`${className}_students`);
        const studentsList = students ? JSON.parse(students) : [];
        return studentsList.find((student: Student) => student.id === id);
    }
}

