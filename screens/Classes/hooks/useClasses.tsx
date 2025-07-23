import { SQLiteService } from '@/database/db';
import { IClassesData } from '../interfaces/IStudentData';

export function useClasses() {
  async function loadingClasses(): Promise<[IClassesData] | void> {
    return await SQLiteService.getClassesReportData()
      .then((result: unknown) => {
        if (Array.isArray(result) && result.length > 0) {
          return result as [IClassesData];
        }
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
