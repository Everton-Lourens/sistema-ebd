import { IRegisterData } from '@/components/screens/Register/interfaces/IRegisterData';
import { logger } from '@/helper/logger';
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
                class TEXT NOT NULL
            );
        `);
    };

    static insertStudent = ({ name, studentClass }: IRegisterData) => {
        return new Promise((resolve, reject) => {
            try {
                const id = Crypto.randomUUID();
                db.runAsync(
                    'INSERT INTO students (id, name, studentClass) VALUES (?, ?, ?)',
                    id,
                    name,
                    studentClass
                );
                resolve(true);
            } catch (error) {
                reject(error);
                logger.error(error);
            }
        });
    };

    static getStudents() {
        return db
            .getAllAsync('SELECT * FROM students')
            .then((result) => result)
            .catch((error) => {
                console.error('Erro ao buscar todos os estudantes:', error);
                throw error;
            });
    }

}

SQLiteService.init();
function uuid(): SQLite.SQLiteBindValue {
    throw new Error('Function not implemented.');
}

