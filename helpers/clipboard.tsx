import { IReportData } from '@/screens/Report/interfaces/IReportData';
import * as Clipboard from 'expo-clipboard';
import { getToday } from './format';

export const copyResumeToClipboard = (data: IReportData) => {
  if (data === undefined) throw new Error('Erro ao copiar dados');
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
  `.trim();
  Clipboard.setStringAsync(formatted);
};