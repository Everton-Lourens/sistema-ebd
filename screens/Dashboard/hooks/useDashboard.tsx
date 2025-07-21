import { SQLiteService } from '@/database/db';
import { IDashboardData } from '../interfaces/IStudentData';

export function useDashboard() {
  async function loadingDashboard(): Promise<[IDashboardData] | void> {
    return await SQLiteService.getDashboardData()
      .then((result: unknown) => {
        // If result is an array, extract the first element or map as needed
        if (Array.isArray(result) && result.length > 0) {
          return result as [IDashboardData];
        }
        // If result is already an object, cast it
        return result as [IDashboardData];
      })
      .catch((error) => {
        console.log(error)
        throw error
      })
  }

  return {
    loadingDashboard,
  }
}
