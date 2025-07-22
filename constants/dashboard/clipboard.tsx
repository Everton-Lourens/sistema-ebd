import * as Clipboard from 'expo-clipboard';

export const copyResumeToClipboard = (data: any) => {
    if (data === undefined) throw new Error('Erro ao copiar dados');
    const formatted = `
*CLASSE: ${data.className}*
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