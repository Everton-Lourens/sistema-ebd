import { SQLiteService } from '@/database/db';
import { IRegisterData } from '../interfaces/IRegisterData';

export function useFormAuth() {
  async function onRegister(registerData: IRegisterData) {
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
