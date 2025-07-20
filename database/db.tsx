import { logger } from '@/helper/logger';
import { IStudentData } from '@/screens/Register/interfaces/IStudentData';
import * as Crypto from 'expo-crypto';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabaseSync('myDB.db');
export class SQLiteService {

    static init = () => {
        SQLiteService.createTable();
    };

    private static createTable = () => {
        db.execAsync(`
            CREATE TABLE IF NOT EXISTS students (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                studentClass TEXT NOT NULL
            );
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

}

SQLiteService.init();


