import { logger } from '@/helper/logger';
import { IStudentData } from '@/screens/Register/interfaces/IStudentData';
import * as Crypto from 'expo-crypto';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabaseSync('myDB.db');

export class SQLiteService {

    static init = () => {
        SQLiteService.createTable();
        logger.info('Database initialized');
    };

    private static createTable = async () => {
        await db.execAsync(`
            DROP TABLE IF EXISTS classes;
            DROP TABLE IF EXISTS students;
            DROP TABLE IF EXISTS detailsClasses;
            DROP TABLE IF EXISTS attendance;
            PRAGMA foreign_keys = ON;

            CREATE TABLE IF NOT EXISTS classes (
                id TEXT PRIMARY KEY NOT NULL,
                date TEXT NOT NULL DEFAULT CURRENT_DATE,
                name TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS students (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                date TEXT NOT NULL DEFAULT CURRENT_DATE,
                classId TEXT NOT NULL,
                FOREIGN KEY (classId) REFERENCES classes(id)
            );

            CREATE TABLE IF NOT EXISTS detailsClasses (
                id TEXT PRIMARY KEY NOT NULL,
                offer TEXT NOT NULL,
                visitors NUMBER,
                date TEXT NOT NULL DEFAULT CURRENT_DATE,
                classId TEXT NOT NULL,
                FOREIGN KEY (classId) REFERENCES classes(id)
            );

            CREATE TABLE IF NOT EXISTS attendance (
                id TEXT PRIMARY KEY NOT NULL,
                studentId TEXT NOT NULL,
                date TEXT NOT NULL DEFAULT CURRENT_DATE,
                present BOOLEAN NOT NULL,
                bible NUMBER,
                magazine NUMBER,
                FOREIGN KEY (studentId) REFERENCES students(id)
            );

            INSERT OR IGNORE INTO classes (id, name) VALUES
                ('1', 'Crianças Menores'),
                ('2', 'Crianças Maiores'),
                ('3', 'Adolescentes'),
                ('4', 'Jovens'),
                ('5', 'Senhores'),
                ('6', 'Senhoras');

            INSERT OR IGNORE INTO students (id, name, classId) VALUES
                    ('s1', 'Ana', '1'),
                    ('s2', 'Bruno', '1'),
                    ('s3', 'Clara', '2'),
                    ('s4', 'Daniel', '2'),
                    ('s5', 'Eduardo', '3'),
                    ('s6', 'Fernanda', '3'),
                    ('s7', 'Gustavo', '4'),
                    ('s8', 'Helena', '4'),
                    ('s9', 'Igor', '5'),
                    ('s10', 'Joana', '5'),
                    ('s11', 'Karina', '6'),
                    ('s12', 'Lucas', '6');

            INSERT OR IGNORE INTO attendance (id, studentId, present, bible, magazine) VALUES
                ('a1', 's1', 1, 1, 1),
                ('a2', 's2', 0, 0, 0),
                ('a3', 's3', 1, 1, 1),
                ('a4', 's4', 1, 1, 1),
                ('a5', 's5', 0, 0, 0),
                ('a6', 's6', 1, 1, 1),
                ('a7', 's7', 1, 1, 1),
                ('a8', 's8', 1, 1, 1),
                ('a9', 's9', 0, 0, 0),
                ('a10', 's10', 0, 0, 0),
                ('a11', 's11', 1, 1, 1),
                ('a12', 's12', 1, 1, 1);

            INSERT OR IGNORE INTO detailsClasses (id, offer, visitors, classId) VALUES
                ('dc1', 'R$ 1,00', 1, '1'),
                ('dc2', 'R$ 4,00', 0, '2'),
                ('dc3', 'R$ 1,00', 0, '3'),
                ('dc4', 'R$ 1,00', 20, '4'),
                ('dc5', 'R$ 5,00', 0, '5'),
                ('dc6', 'R$ 1,00', 0, '6');
        `);

    };

    static insertStudent = async ({ name, studentClass }: IStudentData) => {
        try {
            const id = Crypto.randomUUID();
            await db.runAsync(
                'INSERT INTO students (id, name, studentClass) VALUES (?, ?, ?)',
                id,
                name,
                studentClass
            );
            return true;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    };

    static getStudents = async () => {
        try {
            const result = await db.getAllAsync('SELECT * FROM students');
            console.log(result);
            return result;
        } catch (error) {
            console.error('Erro ao buscar todos os estudantes:', error);
            logger.error(error);
            throw error;
        }
    };


    static getStudentById = async (id: string) => {
        try {
            const result = await db.getAllSync('SELECT * FROM students WHERE id = ?', id);
            console.log(result);
            return result;
        } catch (error) {
            console.error('Erro ao buscar estudante por id:', error);
            logger.error(error);
            throw error;
        }
    };

    static getClasses = async () => {
        try {
            const result = await db.getAllAsync('SELECT * FROM classes');
            console.log(JSON.stringify(result, null, 2));
            return result;
        } catch (error) {
            logger.error('Erro ao buscar todas as classes: ' + error);
            throw error;
        }
    };

    static getDashboardClasses = async () => {
        try {
            const result = await db.getAllAsync(`
                SELECT
                    s.classId,
                    c.name AS className,
                    COUNT(s.id) AS enrolled,
                    SUM(CASE WHEN a.present = 0 THEN 1 ELSE 0 END) AS absent,
                    SUM(CASE WHEN a.present = 1 THEN 1 ELSE 0 END) AS present,
                    COALESCE(dc.visitors, 0) AS visitors,
                    SUM(CASE WHEN a.present = 1 THEN 1 ELSE 0 END) + COALESCE(dc.visitors, 0) AS total,
                    SUM(COALESCE(a.bible, 0)) AS bible,
                    SUM(COALESCE(a.magazine, 0)) AS magazine,
                    dc.offer
                FROM students s
                LEFT JOIN classes c ON c.id = s.classId
                LEFT JOIN attendance a ON a.studentId = s.id AND a.date = CURRENT_DATE
                LEFT JOIN detailsClasses dc ON dc.classId = s.classId
                GROUP BY s.classId, c.name, dc.visitors
            `);

            console.log(JSON.stringify(result, null, 2));
            return result;
        } catch (error) {
            logger.error('Erro ao contar alunos por classe: ' + error);
            throw error;
        }
    };

}

SQLiteService.init();


