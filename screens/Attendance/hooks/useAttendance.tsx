import { SQLiteService } from '@/database/db';
import { IAttendanceData } from '../interfaces/IAttendanceData';

export function useAttendance() {
  async function loadingAttendance(classId: number): Promise<[IAttendanceData] | void> {
    return await SQLiteService.getAttendanceByClassId(classId)
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
  async function insertAttendance(item: any): Promise<[IAttendanceData] | void> {
    return await SQLiteService.insertAttendance(item)
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
  async function insertDetailsClasses(item: { offer: number; visitors: number; classId: number }): Promise<[IAttendanceData] | void> {
    return await SQLiteService.insertDetailsClasses(item)
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
    insertAttendance,
    getAttendance,
    insertDetailsClasses
  }
}
