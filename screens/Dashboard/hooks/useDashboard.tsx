import { SQLiteService } from '@/database/db';
import { IDashboardData } from '../interfaces/IStudentData';

export function useDashboard() {
  async function getDashboardData(): Promise<IDashboardData | void> {
    await SQLiteService.getDashboardClasses()
      .catch((error) => {
        console.log(error)
        throw error
      })
  }
  return {
    getDashboardData,
  }
}
