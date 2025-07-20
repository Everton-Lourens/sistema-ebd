import { logger } from '@/helper/logger';
import { IStudentData } from '@/screens/Register/interfaces/IStudentData';
import * as Crypto from 'expo-crypto';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabaseSync('myDB.db');

export class SQLiteService {

    static init = () => {
        SQLiteService.createTable();
    };

    private static createTable = async () => {
        await db.execAsync(`
            PRAGMA foreign_keys = ON;

            CREATE TABLE IF NOT EXISTS classes (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS students (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                classId TEXT NOT NULL,
                FOREIGN KEY (classId) REFERENCES classes(id)
            );

            INSERT OR IGNORE INTO classes (id, name) VALUES
                ('1', 'Crianças Menores'),
                ('2', 'Crianças Maiores'),
                ('3', 'Adolescentes'),
                ('4', 'Jovens'),
                ('5', 'Senhores'),
                ('6', 'Senhoras');
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
            const result = await db.getAllAsync('SELECT * FROM students');
            console.log(JSON.stringify(result, null, 2));
            return result;
        } catch (error) {
            logger.error('Erro ao buscar todas as classes: ' + error);
            throw error;
        }
    };

}

SQLiteService.init();


