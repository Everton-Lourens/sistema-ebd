import { formatToCurrency } from "./format";

export function formatClass(rawData: object | string) {
   if (!rawData) return null;
   try {
      const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

      let result = {};

      for (const className in data) {
         const group = data[className];
         const students = group;

         const visitantes = group.find(item => item.guestNumber)?.guestNumber || 0;
         const ofertas = group.find(item => item.offersNumber)?.offersNumber || 0;
         const matriculados = students.filter(s => s.name).length;
         const presentes = students.filter(s => s.present === true).length;
         const ausentes = students.filter(s => s.present === false).length;
         const biblias = students.filter(s => s.present && s.bible).length;
         const revistas = students.filter(s => s.present && s.magazine).length;
         const total = (Number(presentes) + Number(visitantes));
         const porcentagem = ((presentes / matriculados) * 100).toFixed(2);
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
            attendancePercentage: `${porcentagem}%`
         };
      }
      return result;
   } catch (e) {
      //console.log(e);
      return null
   }
}

export function formatGeralClass(rawData: object | string) {
   if (!rawData) return null;
   try {
      const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

      const totalMatriculados = Object.values(data).reduce((acc, curr) => acc + curr.enrolled, 0);
      const totalPresentes = Object.values(data).reduce((acc, curr) => acc + curr.present, 0);
      const totalVisitantes = Object.values(data).reduce((acc, curr) => acc + Number(curr.visitors), 0);
      const totalOfertas = Object.values(data).reduce((acc, curr) => {
         const valorStr = curr.offers
            .replace(/\s/g, '')
            .replace('R$', '')
            .replace(',', '.');
         const valor = parseFloat(valorStr);
         return acc + (isNaN(valor) ? 0 : valor);
      }, 0);
      const totalBiblias = Object.values(data).reduce((acc, curr) => acc + curr.bibles, 0);
      const totalRevistas = Object.values(data).reduce((acc, curr) => acc + curr.magazines, 0);

      const result = {
         enrolled: totalMatriculados,
         present: totalPresentes,
         visitors: totalVisitantes,
         total: Number(totalPresentes) + Number(totalVisitantes),
         bibles: totalBiblias,
         magazines: totalRevistas,
         offers: formatToCurrency(Number(totalOfertas)),
         attendancePercentage: (((Number(totalPresentes) / Number(totalMatriculados)) * 100) || 0).toFixed(2) + '%'
      };
      return [result];
   } catch (e) {
      //console.log(e);
      return null
   }
}
