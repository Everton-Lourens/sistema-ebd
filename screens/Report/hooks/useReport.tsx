import { SQLiteService } from '@/database/db';
import { IReportData } from '../interfaces/IReportData';

export function useReport() {
  async function loadingGeneralReport(): Promise<[IReportData] | void> {
    return await SQLiteService.getGeneralReportData()
      .then((result: unknown) => {
        if (Array.isArray(result) && result.length > 0) {
          return result as [IReportData];
        }
        return result as [IReportData];
      })
      .catch((error) => {
        console.log(error)
        throw error
      })
  }
  async function loadingRankingPresent(): Promise<any> {
    return await SQLiteService.getRankingPresentData()
      .then((result: unknown) => {
        return result || []
      })
      .catch((error) => {
        console.log(error)
        throw error
      })
  }

  async function loadingRankingOffer(): Promise<any> {
    return await SQLiteService.getRankingOfferData()
      .then((result: unknown) => {
        return result || []
      })
      .catch((error) => {
        console.log(error)
        throw error
      })
  }

  return {
    loadingGeneralReport,
    loadingRankingPresent,
    loadingRankingOffer
  }
}
