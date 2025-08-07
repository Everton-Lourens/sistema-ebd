import { SQLiteService } from '@/database/db';
import { IAttendanceData } from '../interfaces/IAttendanceData';

export function useAttendance() {
  async function loadingAttendance(classId: number): Promise<[IAttendanceData] | void> {
    return await SQLiteService.getStudentByClassId(classId)
      .then((result: unknown) => {
        if (Array.isArray(result) && result.length > 0) {
          return result as [IAttendanceData];
        }
        return result as [IAttendanceData];
      })
      .catch((error) => {
        console.log(error)
        throw error
      })
  }
  async function getAttendance(): Promise<any> {
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
    loadingAttendance,
    getAttendance
  }
}
