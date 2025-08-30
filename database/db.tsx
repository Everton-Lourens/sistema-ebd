import { getToday } from '@/helpers/format';
import { logger } from '@/helpers/logger';
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
                ('s1', 'Gidene', 5),
                ('s2', 'Geni', 5),
                ('s3', 'Paulo Cesar', 5),
                ('s4', 'Pr. João Roberto', 5),
                ('s5', 'Pb. João Nivaldo', 5),
                ('s6', 'Aux. André', 5),
                ('s7', 'Pb. Amós', 5),
                ('s8', 'Dc. Carlos Gusmão', 5),
                ('s9', 'Maicon', 5),
                ('s10', 'Antônio Charles', 5),
                ('s11', 'Aux. Márcio', 5),
                ('s12', 'Aux. Joilton', 5),
                ('s13', 'Micael', 5),
                ('s14', 'Francisco Paulo', 5),
                ('s15', 'Edson', 5),
                ('s16', 'Alan Lopes', 5),
                ('s17', 'Inocêncio', 5),
                ('s18', 'Ir. Miro', 5),
                ('s19', 'Nirlene', 6),
                ('s20', 'Licia', 6),
                ('s21', 'Marlene', 6),
                ('s22', 'Sandra', 6),
                ('s23', 'Vivalma', 6),
                ('s24', 'Valdelice', 6),
                ('s25', 'Marinalva', 6),
                ('s26', 'Maria das Graças', 6),
                ('s27', 'Amanda', 6),
                ('s28', 'Andréia', 6),
                ('s29', 'Lícera', 6),
                ('s30', 'Tania', 6),
                ('s31', 'Maria Eduarda', 6),
                ('s32', 'Nice', 6),
                ('s33', 'Loide', 6),
                ('s34', 'Edna', 6),
                ('s35', 'Fátima', 6),
                ('s36', 'Lucia', 6),
                ('s37', 'Rute', 6),
                ('s38', 'Genivalda', 6),
                ('s39', 'Maria das Neves', 6),
                ('s40', 'Davina', 6),
                ('s41', 'Marineuza', 6),
                ('s42', 'Marize', 6),
                ('s43', 'Marialva', 6),
                ('s44', 'Patrícia', 6),
                ('s45', 'Késia', 6),
                ('s46', 'Zelma', 6),
                ('s47', 'Sara', 6),
                ('s48', 'Joana', 6),
                ('s49', 'Marluce', 6),
                ('s50', 'Marileide', 6),
                ('s51', 'Raymille', 6),
                ('s52', 'Cecília', 6),
                ('s53', 'Cristina', 6),
                ('s54', 'Simone', 6),
                ('s55', 'Jaqueline', 6),
                ('s56', 'Marizete', 6),
                ('s57', 'Marta Coelho', 6),
                ('s58', 'Josete Santos', 6),
                ('s59', 'Jozete Souza', 6),
                ('s60', 'Milena', 6),
                ('s61', 'Valdelice Ferreira', 6),
                ('s62', 'Rosangela Lopes', 6),
                ('s63', 'Fabiane Almeida', 6),
                ('s64', 'Larissa Ferreira (professora)', 4),
                ('s65', 'Lorenna', 4),
                ('s66', 'Larissa Silva', 4),
                ('s67', 'Marcelo (professor)', 4),
                ('s68', 'Mateus (professor)', 4),
                ('s69', 'Marieta', 4),
                ('s70', 'Milena (professora)', 4),
                ('s71', 'Lucas', 4),
                ('s72', 'Carlos Alan', 4),
                ('s73', 'Everton', 4),
                ('s74', 'Cleverton (professor)', 4),
                ('s75', 'Alaís', 4),
                ('s76', 'Tiago', 4),
                ('s77', 'Joice', 4),
                ('s78', 'Tainan (professora)', 4),
                ('s79', 'Taiz', 4),
                ('s80', 'Sayonara', 4),
                ('s81', 'Thierry', 4),
                ('s82', 'Tarcisio', 4),
                ('s83', 'Benfamim (França)', 1),
                ('s84', 'Saimon', 1),
                ('s85', 'Manuela', 1),
                ('s86', 'Bernardo', 1),
                ('s87', 'Emamuel', 1),
                ('s88', 'Ester (Edna)', 1),
                ('s89', 'Luiza', 1),
                ('s90', 'Ana Julia', 1),
                ('s91', 'Luan', 1),
                ('s92', 'Henzo', 1),
                ('s93', 'Isaac', 2),
                ('s94', 'João Victor', 2),
                ('s95', 'João (pb. João)', 2),
                ('s96', 'Emanuel', 2),
                ('s97', 'Beijamim', 2),
                ('s98', 'Laura', 2),
                ('s99', 'Maria Eduarda', 2),
                ('s100', 'Samuel', 3),
                ('s101', 'Ester', 3),
                ('s102', 'Isaque', 3),
                ('s103', 'Juninho', 3),
                ('s104', 'Alanna', 3),
                ('s105', 'Gabriel', 3),
                ('s106', 'Eloisa', 3),
                ('s107', 'Hanna', 3),
                ('s108', 'Raissa', 3),
                ('s109', 'Tiago', 3),
                ('s110', 'Raquel', 3),
                ('s111', 'Breno (professor)', 3),
                ('s112', 'Natã', 3),
                ('s113', 'Nicole', 3),
                ('s114', 'Maria Eduarda', 3),
                ('s115', 'Railan', 3);

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

    static insertAttendance = async ({ studentId, present, bible, magazine }: any) => {
        if (!studentId) {
            throw new Error('Student ID is required');
        }
        try {
            const date = getToday();
            const existing = await db.getFirstAsync(
                'SELECT id FROM attendance WHERE studentId = ? AND date = ?',
                studentId,
                date
            );

            if (existing) {
                await db.runAsync(
                    `UPDATE attendance
                    SET present = ?, bible = ?, magazine = ?
                    WHERE studentId = ? AND date = ?`,
                    present,
                    bible,
                    magazine,
                    studentId,
                    date
                );
            } else {
                const id = Crypto.randomUUID();
                await db.runAsync(
                    `INSERT INTO attendance (id, studentId, present, bible, magazine, date)
                    VALUES (?, ?, ?, ?, ?, ?)`,
                    id,
                    studentId,
                    present,
                    bible,
                    magazine,
                    date
                );
            }
            return true;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    };

    static insertDetailsClasses = async ({ offer, visitors, classId }: { offer: number; visitors: number; classId: number }) => {
        if (!classId) {
            throw new Error('Class ID is required');
        }
        console.log('Inserting detailsClasses with offer:', offer, 'and visitors:', visitors);
        const date = getToday();
        try {
            const existing = await db.getFirstAsync(
                'SELECT id FROM detailsClasses WHERE classId = ? AND date = ?',
                classId,
                date
            );

            if (existing) {
                await db.runAsync(
                    `UPDATE detailsClasses
                    SET offer = ?, visitors = ?, date = ?
                    WHERE classId = ?`,
                    offer,
                    visitors,
                    date,
                    classId
                );
            } else {
                console.log('Inserting NEW detailsClasses @@@@@@@@@@@ 2222222');
                const id = Crypto.randomUUID();
                await db.runAsync(
                    `INSERT INTO detailsClasses (id, offer, visitors, classId, date)
                    VALUES (?, ?, ?, ?, ?)`,
                    id,
                    offer,
                    visitors,
                    classId,
                    date
                );
            }
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
            console.error('@@@ -- @@@ Erro ao buscar todos os estudantes:', error);
            logger.error(error);
            throw error;
        }
    };

    static getStudentById = async (id: number) => {
        try {
            const result = await db.getAllSync('SELECT * FROM students WHERE id = ?', id);
            return result;
        } catch (error) {
            console.error('@@@ -- @@@ Erro ao buscar estudante por id:', error);
            logger.error(error);
            throw error;
        }
    };

    static getStudentByClassId = async (classId: number) => {
        if (!classId) {
            throw new Error('Class ID is required');
        }
        try {
            const result = await db.getAllSync(`
                SELECT 
                    s.id,
                    CASE 
                        WHEN instr(s.name, ' ') > 0 THEN substr(s.name, 1, instr(s.name, ' ') - 1)
                        ELSE s.name
                    END AS name,
                    s.name AS fullName,
                    strftime('%d/%m/%Y', s.date) AS date,
                    s.classId,
                    c.name AS className
                FROM students s
                INNER JOIN classes c ON s.classId = c.id
                WHERE s.classId = ?
            `, classId);
            return result;
        } catch (error) {
            console.error('@@@ -- @@@ Erro ao buscar estudante por ClassId:', error);
            logger.error(error);
            throw error;
        }
    };

    static getAttendanceByClassId = async (classId: number) => {
        if (!classId) {
            throw new Error('Class ID is required');
        }
        const date = getToday();
        try {
            const result = await db.getAllSync(`
                SELECT 
                    s.id,
                CASE
                    WHEN instr(substr(s.name, instr(s.name, ' ') + 1), ' ') > 0 
                    THEN substr(
                        s.name,
                        1,
                        instr(s.name, ' ') + instr(substr(s.name, instr(s.name, ' ') + 1), ' ')
                    )
                    WHEN instr(s.name, ' ') > 0
                    THEN s.name
                    ELSE s.name
                END AS name,
                    s.name AS fullName,
                    strftime('%d/%m/%Y', s.date) AS date,
                    s.classId,
                    c.name AS className,
                    a.present AS present,
                    a.bible AS bible,
                    a.magazine AS magazine
                FROM students s
                INNER JOIN classes c ON s.classId = c.id
                LEFT JOIN attendance a ON s.id = a.studentId AND a.date = ?
                WHERE s.classId = ?
            `,
                date,
                classId,
            );
            return result;
        } catch (error) {
            console.error('@@@ -- @@@ Erro ao buscar estudante por ClassId:', error);
            logger.error(error);
            throw error;
        }
    };

    static getAttendance = async (classId: number) => {
        const date = getToday();
        try {
            const result = await db.getAllAsync(`
                SELECT 
                    a.id,
                    a.studentId,
                    s.name,
                    a.present,
                    a.bible,
                    a.magazine
                FROM attendance a
                INNER JOIN students s ON a.studentId = s.id
                WHERE s.classId = ? AND a.date = ?
            `,
                classId,
                date
            );
            return result;
        } catch (error) {
            console.error('@@@ -- @@@ Erro ao buscar todos os estudantes:', error);
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
            const date = getToday();
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
                    'R$ ' || REPLACE(printf('%.2f', COALESCE(dc.offer, 0) / 100.0), '.', ',') AS offer,
                    CONCAT(ROUND((SUM(CASE WHEN a.present = 1 THEN 1 ELSE 0 END) * 100.0) / COUNT(s.id), 2), '%') AS attendancePercentage,
                    CONCAT(ROUND((SUM(COALESCE(a.bible, 0)) * 100.0) / COUNT(s.id), 2), '%') AS biblePercentage,
                    CONCAT(ROUND((SUM(COALESCE(a.magazine, 0)) * 100.0) / COUNT(s.id), 2), '%') AS magazinePercentage
                FROM students s
                LEFT JOIN classes c ON c.id = s.classId
                LEFT JOIN attendance a ON a.studentId = s.id AND a.date = ?
                LEFT JOIN detailsClasses dc ON dc.classId = s.classId AND dc.date = ?
                GROUP BY s.classId, c.name, dc.visitors;
            `,
                date,
                date
            );
            //console.log(JSON.stringify(result, null, 2));
            return result;
        } catch (error) {
            logger.error('Erro ao contar alunos por classe: ' + error);
            throw error;
        }
    };

    static getGeneralReportData = async () => {
        const date = getToday();
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
                    LEFT JOIN attendance a ON a.studentId = s.id AND a.date = ?
                ),
                details_data AS (
                    SELECT
                        SUM(visitors) AS visitors,
                        SUM(offer) AS offer
                    FROM detailsClasses
                    WHERE date = ?
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
                    'R$ ' || REPLACE(printf('%.2f', COALESCE(dd.offer, 0) / 100.0), '.', ',') AS offer,
                    CONCAT(ROUND((sd.present * 100.0) / sd.enrolled, 2), '%') AS attendancePercentage,
                    CONCAT(ROUND((sd.bible * 100.0) / sd.enrolled, 2), '%') AS biblePercentage,
                    CONCAT(ROUND((sd.magazine * 100.0) / sd.enrolled, 2), '%') AS magazinePercentage
                FROM student_data sd
                CROSS JOIN details_data dd;
            `,
                date,
                date
            );
            //console.log(JSON.stringify(result, null, 2));
            return result;
        } catch (error) {
            logger.error('Erro no total geral das classes: ' + error);
            throw error;
        }
    };

    static getRankingPresentData = async () => {
        const date = getToday();
        try {
            const result = await db.getAllAsync(`
                SELECT
                    c.name AS className,
                    SUM(CASE WHEN a.present = 1 THEN 1 ELSE 0 END) AS present,
                    CONCAT(
                        ROUND(
                            (SUM(CASE WHEN a.present = 1 THEN 1 ELSE 0 END) * 100.0) / 
                            COUNT(s.id), 
                        2),
                        '%'
                    ) AS attendancePercentage
                FROM students s
                LEFT JOIN classes c ON c.id = s.classId
                LEFT JOIN attendance a ON a.studentId = s.id AND a.date = ?
                GROUP BY c.id, c.name
                ORDER BY
                    (SUM(CASE WHEN a.present = 1 THEN 1 ELSE 0 END) * 100.0) / COUNT(s.id) DESC;
            `,
                date
            );
            //console.log(JSON.stringify(result, null, 2));
            return result;
        } catch (error) {
            logger.error('Erro no total geral das classes: ' + error);
            throw error;
        }
    };

    static getRankingOfferData = async () => {
        const date = getToday();
        try {
            const result = await db.getAllAsync(`
                SELECT
                    c.name AS className,
                    'R$ ' || REPLACE(printf('%.2f', COALESCE(dc.offer, 0) / 100.0), '.', ',') AS offer
                FROM detailsClasses dc
                LEFT JOIN classes c ON c.id = dc.classId
                WHERE dc.date = ?
                GROUP BY c.id, c.name, dc.offer
                ORDER BY dc.offer DESC;
            `,
                date
            );
            //console.log(JSON.stringify(result, null, 2));
            return result;
        } catch (error) {
            logger.error('Erro no total geral das classes: ' + error);
            throw error;
        }
    };
}

SQLiteService.init();

