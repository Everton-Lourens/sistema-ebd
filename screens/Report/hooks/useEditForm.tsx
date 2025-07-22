import { SQLiteService } from '@/database/db';
export function useEditForm() {
  async function getStudentById(id: string) {
    await SQLiteService.getStudentById(id)
      .catch((error) => {
        console.log(error)
        throw error
      })
  }

  return {
    getStudentById
  }
}
