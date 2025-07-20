import { SQLiteService } from '@/database/db';
import { IStudentData } from '../interfaces/IStudentData';

export function useFormAuth() {
  async function onRegister(registerData: IStudentData) {
    await SQLiteService.insertStudent(registerData)
      .catch((error) => {
        console.log(error)
        throw error
      })
  }
  return {
    onRegister,
  }
}
