import { SQLiteService } from '@/database/db';
import { IClassesData } from '../interfaces/IStudentData';

export function useClasses() {
  async function loadingClasses(): Promise<[IClassesData] | void> {
    return await SQLiteService.getDashboardData()
      .then((result: unknown) => {
        // If result is an array, extract the first element or map as needed
        if (Array.isArray(result) && result.length > 0) {
          return result as [IClassesData];
        }
        // If result is already an object, cast it
        return result as [IClassesData];
      })
      .catch((error) => {
        console.log(error)
        throw error
      })
  }
  async function getClasses(): Promise<any> {
    return await SQLiteService.getClasses()
      .then((result: unknown) => {
        return result || []
      })
      .catch((error) => {
        console.log(error)
        throw error
      })
  }

  return {
    loadingClasses,
    getClasses
  }
}
