import { MyClass } from "@/classes/class";
import { formatToCurrency } from "./format";

type RankingResult = {
   enrolled: number | object;
   absent: number | object;
   present: number | object;
   visitors: number | object;
   total: number | object;
   bibles: string;
   magazines: string;
   offers: string;
   attendancePercentage: string;
   rankingEnrolled?: any;
   rankingPresent?: any;
   rankingVisitors?: any;
   rankingTotal?: any;
   rankingBibles?: any;
   rankingMagazines?: any;
   rankingOffers?: any;
   rankingAttendancePercentage?: any;
};

export function formatClass(rawData: object | string) {
   if (!rawData) return null;
   try {
      const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

      let result: Record<string, any> = {};

      for (const className in data) {
         const group = data[className];
         const students = group;

         const matriculados = students.filter((s: { name: any; }) => s.name).length;
         const ausentes = students.filter((s: { present: boolean; }) => s.present === false).length;
         const presentes = students.filter((s: { present: boolean; }) => s.present === true).length;
         const visitantes = group.find((item: { guestNumber: any; }) => item.guestNumber)?.guestNumber || 0;
         const total = (Number(presentes) + Number(visitantes));
         const ofertas = group.find((item: { offersNumber: any; }) => item.offersNumber)?.offersNumber || 0;
         const bibliasNumber = students.filter((s: { present: any; bible: any; }) => s.present && s.bible).length;
         const biblias = ((bibliasNumber / matriculados) * 100).toFixed(2) || 0;
         const revistasNumber = students.filter((s: { present: any; magazine: any; }) => s.present && s.magazine).length;
         const revistas = ((revistasNumber / matriculados) * 100).toFixed(2) || 0;
         const porcentagem = ((presentes / matriculados) * 100).toFixed(2) || 0;
         //console.log(`\nRelatório da turma: ${className}`);
         //console.log(`Matriculados: ${matriculados}`);
         //console.log(`Ausentes: ${ausentes}`);
         //console.log(`Presentes: ${presentes}`);
         //console.log(`Visitantes: ${visitantes}`);
         //console.log(`Total: ${total}`);
         //console.log(`Bíblias: ${biblias}`);
         //console.log(`Revistas: ${revistas}`);
         //console.log(`Ofertas: R$ ${formatToCurrency(ofertas)}`);
         //console.log(`Porcentagem de presença: ${porcentagem}%`);
         result[className] = {
            className,
            enrolled: matriculados,
            absent: ausentes,
            present: presentes,
            visitors: visitantes,
            total,
            bibles: biblias,
            magazines: revistas,
            offers: formatToCurrency(ofertas),
            attendancePercentage: `${porcentagem}`
         };
      }
      return result;
   } catch (e) {
      //console.log(e);
      return null
   }
}

export function formatGeralClass(rawData: MyClass | object) {
   if (!rawData) return null;
   try {
      const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
      const totalMatriculados = Object.values(data).reduce((acc, curr) => acc + (curr as any).enrolled, 0);
      const totalAusentes = Object.values(data).reduce((acc, curr) => acc + (curr as any).absent, 0);
      const totalPresentes = Object.values(data).reduce((acc, curr) => acc + (curr as any).present, 0);
      const totalVisitantes = Object.values(data).reduce((acc, curr) => (curr as any) + Number((curr as any).visitors), 0);
      const totalOfertas = Object.values(data).reduce((acc, curr) => {
         const valorStr = (curr as any).offers
            .replace(/\s/g, '')
            .replace('R$', '')
            .replace(',', '.');
         const valor = Number(valorStr.replace('.', ''))
         return (curr as any) + (isNaN(valor) ? 0 : valor);
      }, 0);
      const totalBiblias = Object.values(data).reduce((acc, curr) => acc + (curr as any).bibles, 0);
      const totalRevistas = Object.values(data).reduce((acc, curr) => acc + (curr as any).magazines, 0);



      const result: RankingResult = {
         enrolled: totalMatriculados || 0,
         absent: totalAusentes || 0,
         present: totalPresentes || false,
         visitors: totalVisitantes || 0,
         total: Number(totalPresentes) + Number(totalVisitantes),
         bibles: (((Number(totalBiblias) / Number(totalMatriculados)) * 100) || 0).toFixed(2),
         magazines: (((Number(totalRevistas) / Number(totalMatriculados)) * 100) || 0).toFixed(2),
         offers: formatToCurrency(Number(totalOfertas)),
         attendancePercentage: (((Number(totalPresentes) / Number(totalMatriculados)) * 100) || 0).toFixed(2),
      };

      try {
         result.rankingEnrolled = getRanking(data, 'enrolled');
         result.rankingPresent = getRanking(data, 'present')
         result.rankingVisitors = getRanking(data, 'visitors')
         result.rankingTotal = getRanking(data, 'total')
         result.rankingBibles = getRanking(data, 'bibles')
         result.rankingMagazines = getRanking(data, 'magazines')
         result.rankingOffers = getRanking(data, 'offers')
         result.rankingAttendancePercentage = getRanking(data, 'attendancePercentage')
      } catch (e) {
         console.log(e);
      }
      return [result];
   } catch (e) {
      //console.log(e);
      return null
   }
}


export const getRanking = (data: object, campo: string) => {

   return Object.entries(data)
      .sort((a, b) => {
         const valueA = a[1][campo] || '';
         const valueB = b[1][campo] || '';
         const numA = Number(String((valueA ?? '').toString().replace(/[^\d]/g, '')) || '0');
         const numB = Number(String((valueB ?? '').toString().replace(/[^\d]/g, '')) || '0');
         return numB - numA;
      })
      .slice(0, 3)
      .map(([className, values], index) => ({
         ...values,
         className,
         colocacao:
            index === 0
               ? '1º Lugar'
               : index === 1
                  ? '2º Lugar'
                  : '3º Lugar',
      }));
};