import { SQLiteService } from '@/database/db';
export function useEditForm() {
  async function getLoginUser({ login, password }: any) {
    await SQLiteService.getStudentById(login, password)
      .catch((error) => {
        console.log(error)
        throw error
      })
  }

  return {
    getLoginUser
  }
}
