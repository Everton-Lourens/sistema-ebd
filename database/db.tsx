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
        try {
            await db.execAsync(`
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
                offer NUMBER NOT NULL,
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
                    ('s2', 'Carlos', '1'),
                    ('s3', 'Bruno', '1'),
                    ('s4', 'Clara', '2'),
                    ('s5', 'Daniel', '2'),
                    ('s6', 'Eduardo', '3'),
                    ('s7', 'Fernanda', '3'),
                    ('s8', 'Gustavo', '4'),
                    ('s9', 'Helena', '4'),
                    ('s0', 'Igor', '5'),
                    ('s11', 'Maicon', '5'),
                    ('s12', 'Karina', '6'),
                    ('s13', 'Julia', '6'),
                    ('s14', 'Roberta', '6'),
                    ('s15', 'Amanda', '6');

            INSERT OR IGNORE INTO attendance (id, studentId, present, bible, magazine) VALUES
                ('a1', 's1', 1, 1, 1),
                ('a2', 's2', 0, 0, 0),
                ('a3', 's3', 1, 1, 1),
                ('a4', 's4', 1, 1, 1),
                ('a5', 's5', 0, 0, 0),
                ('a6', 's6', 1, 1, 1),
                ('a7', 's7', 1, 1, 1),
                ('a8', 's8', 1, 1, 1),
                ('a9', 's9', 0, 0, 0);

            INSERT OR IGNORE INTO detailsClasses (id, offer, visitors, classId) VALUES
                ('dc1', 100, 1, '1'),
                ('dc2', 400, 0, '2'),
                ('dc3', 100, 1, '3'),
                ('dc4', 100, 2, '4'),
                ('dc5', 500, 0, '5'),
                ('dc6', 100, 3, '6');
        `);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    };

    static insertStudent = async ({ name, classId }: IStudentData) => {
        try {
            const id = Crypto.randomUUID();
            await db.runAsync(
                'INSERT INTO students (id, name, classId) VALUES (?, ?, ?)',
                id,
                name,
                classId
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
            return result;
        } catch (error) {
            logger.error('Erro ao buscar todas as classes: ' + error);
            throw error;
        }
    };

    static getClassesReportData = async () => {
        try {
            const result = await db.getAllAsync(`
                SELECT
                    s.classId as id,
                    c.name AS className,
                    COUNT(s.id) AS enrolled,
                    (COUNT(s.id) - SUM(CASE WHEN a.present = 1 THEN 1 ELSE 0 END)) AS absent,
                    SUM(CASE WHEN a.present = 1 THEN 1 ELSE 0 END) AS present,
                    COALESCE(dc.visitors, 0) AS visitors,
                    SUM(CASE WHEN a.present = 1 THEN 1 ELSE 0 END) + COALESCE(dc.visitors, 0) AS total,
                    SUM(COALESCE(a.bible, 0)) AS bible,
                    SUM(COALESCE(a.magazine, 0)) AS magazine,
                    dc.offer,
                    CONCAT(ROUND((SUM(CASE WHEN a.present = 1 THEN 1 ELSE 0 END) * 100.0) / COUNT(s.id), 2), '%') AS attendancePercentage,
                    CONCAT(ROUND((SUM(COALESCE(a.bible, 0)) * 100.0) / COUNT(s.id), 2), '%') AS biblePercentage,
                    CONCAT(ROUND((SUM(COALESCE(a.magazine, 0)) * 100.0) / COUNT(s.id), 2), '%') AS magazinePercentage
                FROM students s
                LEFT JOIN classes c ON c.id = s.classId
                LEFT JOIN attendance a ON a.studentId = s.id AND a.date = CURRENT_DATE
                LEFT JOIN detailsClasses dc ON dc.classId = s.classId
                GROUP BY s.classId, c.name, dc.visitors;
            `);
            console.log(JSON.stringify(result, null, 2));
            return result;
        } catch (error) {
            logger.error('Erro ao contar alunos por classe: ' + error);
            throw error;
        }
    };

    static getGeneralReportData = async () => {
        try {
            const result = await db.getAllAsync(`
        -- Totais gerais
                WITH student_data AS (
                    SELECT
                        COUNT(s.id) AS enrolled,
                        SUM(CASE WHEN a.present = 1 THEN 1 ELSE 0 END) AS present,
                        SUM(CASE WHEN a.present != 1 OR a.present IS NULL THEN 1 ELSE 0 END) AS absent,
                        SUM(COALESCE(a.bible, 0)) AS bible,
                        SUM(COALESCE(a.magazine, 0)) AS magazine
                    FROM students s
                    LEFT JOIN attendance a ON a.studentId = s.id AND a.date = CURRENT_DATE
                ),
                details_data AS (
                    SELECT
                        SUM(visitors) AS visitors,
                        SUM(offer) AS offer
                    FROM detailsClasses
                    WHERE date = CURRENT_DATE
                )
                SELECT
                    'total' AS id,
                    'Total Geral' AS className,
                    sd.enrolled,
                    sd.absent,
                    sd.present,
                    COALESCE(dd.visitors, 0) AS visitors,
                    sd.present + COALESCE(dd.visitors, 0) AS total,
                    sd.bible,
                    sd.magazine,
                    COALESCE(dd.offer, 0) AS offer,
                    CONCAT(ROUND((sd.present * 100.0) / sd.enrolled, 2), '%') AS attendancePercentage,
                    CONCAT(ROUND((sd.bible * 100.0) / sd.enrolled, 2), '%') AS biblePercentage,
                    CONCAT(ROUND((sd.magazine * 100.0) / sd.enrolled, 2), '%') AS magazinePercentage
                FROM student_data sd
                CROSS JOIN details_data dd;
            `);
            console.log(JSON.stringify(result, null, 2));
            return result;
        } catch (error) {
            logger.error('Erro no total geral das classes: ' + error);
            throw error;
        }
    };
}

SQLiteService.init();


