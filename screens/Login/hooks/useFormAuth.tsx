import { SQLiteService } from '@/database/db';
import { ILoginData } from '../interfaces/ILoginData';

export function useFormAuth() {
  async function onRegister(loginData: ILoginData) {
    await SQLiteService.insertStudent(loginData)
      .catch((error) => {
        console.log(error)
        throw error
      })
  }
  return {
    onRegister,
  }
}
