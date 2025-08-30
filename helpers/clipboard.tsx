import { SQLiteService } from '@/database/db';
import { IReportData } from '@/screens/Report/interfaces/IReportData';
import * as Clipboard from 'expo-clipboard';
import { getToday } from './format';

export const copyResumeToClipboard = (data: IReportData) => {
  try {
    if (data === undefined) throw new Error('Erro ao copiar dados');

    SQLiteService.getAttendance(Number(data.id)).then(async (attendance: any) => {

      let arrayPresentRankingData: any = [];
      let arrayOfferRankingData: any = [];
      if (data.id === 'total') {
        arrayPresentRankingData = await SQLiteService.getRankingPresentData();
        arrayOfferRankingData = await SQLiteService.getRankingOfferData();
      }

      const formatted = `
*${data.className} - ${getToday()}*
--------------
Matriculados: *${data.enrolled}*
Ausentes: *${data.absent}*
Presentes: *${data.present}*
Visitantes: *${data.visitors}*
Total: *${data.total}*
Bíblias: *${data.bible}*
Revistas: *${data.magazine}*
Oferta: *${Number(data.offer.replace(/[^\d]/g, '')) > 0 ? data.offer : 'Não houve'}*
--------------
Presença: *${data.attendancePercentage}*
Bíblia: *${data.biblePercentage}*
Revista: *${data.magazinePercentage}*
--------------
${attendance
          .map((item: any) => {
            return `${item.name}: ${item.present ? '*Presente*' : 'Falta'}\n`;
          })
          .join('')}

${arrayPresentRankingData.length > 0 ? '*Em Presença:*' : ''}
${arrayPresentRankingData.map((item: any, index: number) => {
            return `${index + 1}. ${item.className} - ${item.attendancePercentage}\n`;
          }).join('')}
${arrayOfferRankingData.length > 0 ? '*Em Oferta:*' : ''}
${arrayOfferRankingData.map((item: any, index: number) => {
            return `${index + 1}. ${item.className} - ${item.offer}\n`;
          }).join('')}

  `.trim();

      Clipboard.setStringAsync(formatted);
    });

  } catch (error) {
    console.error(error);
  }
};