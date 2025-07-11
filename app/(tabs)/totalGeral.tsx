import { NewCall } from '@/classes/newCall';
import { initialClasses } from '@/constants/ClassName';
import { compareDate } from '@/helper/date';
import { formatToCurrency } from '@/helper/format';
import * as Clipboard from 'expo-clipboard';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MyClass } from '../../classes/class';

interface IDataSummary {
  className: string;
  enrolled: number;
  absent: number;
  present: number;
  visitors: string;
  total: number;
  bibles: number;
  magazines: number;
  offers: string;
  attendancePercentage: string;
}


const resumoInit = {
  studentNumber: 0,
  presenceNumber: 0,
  bibleNumber: 0,
  magazines: 0,
  guestNumber: 0,
  offersNumber: 0,
};

type DataItem = {
  title: string;
  className: string;
  studentNumber: string;
  presenceNumber: string;
  bibleNumber: string;
  magazines: string;
  guestNumber: string;
  offersNumber: string;
};

export default function Resumo() {
  const [resumo, setResumo] = useState(resumoInit);
  const [allCall, setAllCall] = useState({
    studentNumber: '',
    presenceNumber: '',
    magazines: '',
    bibleNumber: '',
    guestNumber: '',
    offersNumber: '',
  });
  const [almostClear, setAlmostClear] = useState(false);
  const [topPresencas, setTopPresencas] = useState([]);
  const [topOfertas, setTopOfertas] = useState([]);
  const [topBiblias, setTopBiblias] = useState([]);
  const [topRevistas, setTopRevistas] = useState([]);
  const [topVisitantes, setTopVisitantes] = useState([]);
  const [data, setData] = useState<DataItem[]>([]);
  const [empatePresenca, setEmpatePresenca] = useState(false);
  const [empateOfertas, setEmpateOfertas] = useState(false);
  const [empateBiblias, setEmpateBiblias] = useState(false);
  const [empateRevistas, setEmpateRevistas] = useState(false);
  const [empateVisitantes, setEmpateVisitantes] = useState(false);
  const [dataGeral, setDataGeral] = useState<DataItem[]>([]);
  const [isToday, setIsToday] = useState(true);
  const [allStudents, setAllStudents] = useState<MyClass[]>([]);
  const [countStudents, setCountStudents] = useState(0);
  const [totalCall, setTotalCall] = useState({
    totalStudent: 0,
    totalPresence: 0,
    totalBibleNumber: 0,
    totalmagazines: 0,
    totalGuestNumber: 0,
    totalOffersNumber: 0,
  });
  const getTotalGeral = () => {
    const newCall = new NewCall();
    newCall.className = 'TOTAL_GERAL';
    newCall.getCall('TOTAL_GERAL').then((result: any) => {
      if (result) {
        const sameDate = compareDate(result.callDate);
        if (sameDate) setResumo(result);
        else setResumo(resumoInit);
      }
    })
  }

  const getGeralReport = () => {
    setAllStudents([]);
    MyClass.getGeralReport()
      .then((dataSummary: any) => {
        if (Array.isArray(dataSummary) && dataSummary.length === 0) return;
        setAllStudents(Array.isArray(dataSummary) ? dataSummary : Object.values(dataSummary));
        setCountStudents(Object.values(dataSummary).length);
      })
  }

  useFocusEffect(
    useCallback(() => {
      setAllStudents([]);
      getGeralReport();
      return () => {
        setAllStudents([]);
      };
    }, [])
  );

  const getPercentage = (presence: string = '', allStudents: string = ''): number => {
    if (!allStudents || !presence) return 0;
    return parseFloat(((Number(presence) / Number(allStudents)) * 100).toFixed(2)) || 0;
  }

  useFocusEffect(
    useCallback(() => {
      getTotalGeral();
      setData([]);
      updateAllClasses().finally(() => {
        console.log('Atualização finalizada');
        checkEmpateClasses();
      });
    }, [])
  );


  function updateAllClasses() {
    let totalStudent = 0;
    let totalPresence = 0;
    let totalBibleNumber = 0;
    let totalmagazines = 0;
    let totalGuestNumber = 0;
    let totalOffersNumber = 0;
    const newCall = new NewCall();

    const promises = initialClasses.map(({ name }) => {
      newCall.className = name;
      return newCall.getCall(name).then(data => {
        if (data) {
          const isTodayCheck = checkDate(data?.callDate);
          setIsToday(isTodayCheck);
          if (!isTodayCheck || !isToday) return;

          totalStudent += Number(data?.studentNumber) || 0;
          totalPresence += Number(data?.presenceNumber) || 0;
          totalBibleNumber += Number(data?.bibleNumber) || 0;
          totalmagazines += Number(data?.magazines) || 0;
          totalGuestNumber += Number(data?.guestNumber) || 0;
          totalOffersNumber += Number(data?.offersNumber?.replace(/[^\d]/g, '')) || 0;

          setTotalCall({
            totalStudent,
            totalPresence,
            totalBibleNumber,
            totalmagazines,
            totalGuestNumber,
            totalOffersNumber,
          });

          setAllCall(prev => ({
            ...prev,
            [name]: {
              ...data,
              className: data?.className || '',
              studentNumber: data?.studentNumber || '',
              presenceNumber: data?.presenceNumber || '',
              bibleNumber: data?.bibleNumber || '',
              magazines: data?.magazines || '',
              guestNumber: data?.guestNumber || '',
              offersNumber: data?.offersNumber || '',
            }
          }));

          setData(prev => {
            const newData = [
              ...prev,
              {
                title: data?.className || '',
                className: data?.className || '',
                studentNumber: data?.studentNumber || '',
                presenceNumber: data?.presenceNumber || '',
                bibleNumber: data?.bibleNumber || '',
                magazines: data?.magazines || '',
                guestNumber: data?.guestNumber || '',
                offersNumber: data?.offersNumber || '',
              }
            ];

            // remove duplicados
            const uniqueData = newData.filter((item, index) =>
              newData.findIndex(i => i.className === item.className) === index
            );
            return uniqueData;
          });
        } else {
          checkDate();
        }
      });
    });

    return Promise.all(promises).then(() => {
      newCall.className = 'TOTAL_GERAL';
      newCall.studentNumber = totalStudent.toString();
      newCall.presenceNumber = totalPresence.toString();
      newCall.bibleNumber = totalBibleNumber.toString();
      newCall.magazines = totalmagazines.toString();
      newCall.guestNumber = totalGuestNumber.toString();
      newCall.offersNumber = totalOffersNumber.toString();
      newCall.save();
      setDataGeral([{
        title: 'Total Geral',
        studentNumber: totalStudent.toString(),
        presenceNumber: totalPresence.toString(),
        bibleNumber: totalBibleNumber.toString(),
        magazines: totalmagazines.toString(),
        guestNumber: totalGuestNumber.toString(),
        offersNumber: totalOffersNumber.toString(),
      }]);
      console.log('@@@@@@@@@@@@@@ FINALIZADO @@@@@@@@@@@@@@@@@@');
    });
  }

  function checkDate(oldDate = '') {
    let sameDate = false;
    if (!oldDate && !almostClear) {
      sameDate = false;
      setAlmostClear(true);
      clearData();
      return false;
    }

    const date1 = new Date().toISOString();
    const date2 = new Date(oldDate).toISOString();
    function getDateOnly(isoString: string) {
      return isoString.split('T')[0];
    }
    sameDate = getDateOnly(date1) === getDateOnly(date2);

    function clearData() {
      if (!sameDate) {
        setTopPresencas([]);
        setTopOfertas([]);
        setTopBiblias([]);
        setTopRevistas([]);
        setTopVisitantes([]);
        setData([]);
        setEmpatePresenca(false);
        setEmpateOfertas(false);
        setEmpateBiblias(false);
        setEmpateRevistas(false);
        setEmpateVisitantes(false);
        return false
      }
    }
    return sameDate;
  }

  function hasDuplicates(arr: (number | string | undefined | null)[]): boolean {
    const numbers = arr
      .map(n => {
        if (typeof n === 'string') {
          // Remove tudo que não for número, ponto ou vírgula
          const clean = n.replace(/[^\d.,-]/g, '').replace(',', '.');
          return Number(clean);
        }
        return Number(n);
      })
      .filter(n => !isNaN(n) && n > 0); // agora ignora 0 e negativos

    // Se o array está vazio (por exemplo, só tinha zeros ou inválidos), não há duplicatas
    if (numbers.length === 0) return false;

    const unique = new Set(numbers);
    return unique.size !== numbers.length;
  }

  const copiarResumoGeral = (resumo) => {
    const parseNumber = (v) => Number(v) || 0;
    const formatPorcentagem = (v) =>
      isNaN(parseFloat(v)) ? '0.00' : parseFloat(v).toFixed(2);

    const texto = `
Resumo Geral - *${new Date().toLocaleDateString('pt-BR')}*

*=======================*
Total Geral:
Matriculados: *${parseNumber(resumo.enrolled)}*
Ausentes: *${parseNumber(resumo.absent)}*
Presentes: *${parseNumber(resumo.present)}*
Visitantes: *${parseNumber(resumo.visitors)}*
Total: *${parseNumber(resumo.total)}*
Bíblias: *${parseNumber(resumo.bibles)}*
Revistas: *${parseNumber(resumo.magazines)}*
Ofertas: *${parseFloat((resumo.offers || 'R$ 0,00').replace(/[^\d,]/g, '').replace(',', '.')) === 0 ? 'Não houve' : resumo.offers}*
Porcentagem Geral: *${formatPorcentagem(resumo.attendancePercentage)}%*
*=======================*

Vencedores em Presença:\n${hasDuplicates(resumo?.rankingAttendancePercentage.map((item) => item.attendancePercentage)) ? '*> Houve Empate <*' : ''}
1º - *${resumo.rankingAttendancePercentage[0]?.className || ''}*: *${formatPorcentagem(resumo.rankingAttendancePercentage[0]?.attendancePercentage)}%*
2º - *${resumo.rankingAttendancePercentage[1]?.className || ''}*: *${formatPorcentagem(resumo.rankingAttendancePercentage[1]?.attendancePercentage)}%*
3º - *${resumo.rankingAttendancePercentage[2]?.className || ''}*: *${formatPorcentagem(resumo.rankingAttendancePercentage[2]?.attendancePercentage)}%*
*=======================*

Vencedores em Ofertas:\n${hasDuplicates(resumo?.rankingOffers.map((item) => item.offers)) ? '*> Houve Empate <*' : ''}
1º - *${resumo.rankingOffers[0]?.className || ''}*: *${resumo.rankingOffers[0]?.offers || 'R$ 0,00'}*
2º - *${resumo.rankingOffers[1]?.className || ''}*: *${resumo.rankingOffers[1]?.offers || 'R$ 0,00'}*
3º - *${resumo.rankingOffers[2]?.className || ''}*: *${resumo.rankingOffers[2]?.offers || 'R$ 0,00'}*
*=======================*

Vencedores em Bíblias:\n${hasDuplicates(resumo?.rankingBibles.map((item) => item.bibles)) ? '*> Houve Empate <*' : ''}
1º - *${resumo.rankingBibles[0]?.className || ''}*: *${parseNumber(resumo.rankingBibles[0]?.bibles)}*
2º - *${resumo.rankingBibles[1]?.className || ''}*: *${parseNumber(resumo.rankingBibles[1]?.bibles)}*
3º - *${resumo.rankingBibles[2]?.className || ''}*: *${parseNumber(resumo.rankingBibles[2]?.bibles)}*
*=======================*

Vencedores em Revistas:\n${hasDuplicates(resumo?.rankingMagazines.map((item) => item.magazines)) ? '*> Houve Empate <*' : ''}
1º - *${resumo.rankingMagazines[0]?.className || ''}*: *${parseNumber(resumo.rankingMagazines[0]?.magazines)}*
2º - *${resumo.rankingMagazines[1]?.className || ''}*: *${parseNumber(resumo.rankingMagazines[1]?.magazines)}*
3º - *${resumo.rankingMagazines[2]?.className || ''}*: *${parseNumber(resumo.rankingMagazines[2]?.magazines)}*
*=======================*

Vencedores em Visitantes:\n${hasDuplicates(resumo?.rankingVisitors.map((item) => item.visitors)) ? '*> Houve Empate <*' : ''}
1º - *${resumo.rankingVisitors[0]?.className || ''}*: *${parseNumber(resumo.rankingVisitors[0]?.visitors)}*
2º - *${resumo.rankingVisitors[1]?.className || ''}*: *${parseNumber(resumo.rankingVisitors[1]?.visitors)}*
3º - *${resumo.rankingVisitors[2]?.className || ''}*: *${parseNumber(resumo.rankingVisitors[2]?.visitors)}*
  `.trim();

    Clipboard.setStringAsync(texto);
  };


  return (
    <>
      <FlatList
        data={allStudents}
        style={styles.container}
        extraData={[allStudents]}
        renderItem={({ item }) => (
          <>
            <Text style={styles.title}>{item?.className}</Text>
            <View style={styles.item}>
              <Text style={styles.label}>Matriculados:</Text>
              <Text style={styles.value}>{item?.enrolled || 0}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>Ausentes:</Text>
              <Text style={styles.value}>{item?.absent || 0}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>Presentes:</Text>
              <Text style={styles.value}>{item?.present || 0}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>Visitantes:</Text>
              <Text style={styles.value}>{item?.visitors || 0}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>Total:</Text>
              <Text style={styles.value}>{item?.total || 0}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>Bíblias:</Text>
              <Text style={styles.value}>{item?.bibles || 0}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>Revistas:</Text>
              <Text style={styles.value}>{item?.magazines || 0}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>Ofertas:</Text>
              <Text style={styles.value}>{formatToCurrency(item?.offers || 0)}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>Porcentagem:</Text>
              <Text style={styles.value}>{item?.attendancePercentage || 0.00}%</Text>
            </View>
            {allStudents.length > 0 ? (
              <>
                <TouchableOpacity style={styles.button} onPress={() => copiarResumoGeral(item)}>
                  <Text style={styles.buttonText}>Copiar Resumo Geral {item?.className}</Text>
                </TouchableOpacity>
                <Text style={styles.buttonText}>============================================</Text>
                <Text style={styles.buttonText}>============================================</Text>
                <Text style={styles.title}>Vencedores em Presença</Text>
                {(
                  hasDuplicates(item?.rankingAttendancePercentage.map((item) => item.attendancePercentage))
                ) ? (
                  <Text style={{ color: '#b8af02', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                    {'> Houve Empate <'}
                  </Text>
                ) : null}
                <View style={styles.item}>
                  <Text style={styles.label}>1° - {!!item?.rankingAttendancePercentage[0]?.attendancePercentage ? item?.rankingAttendancePercentage[0]?.className : ''}:</Text>
                  <Text style={styles.value}>{!isNaN(item?.rankingAttendancePercentage[0]?.attendancePercentage) && item?.rankingAttendancePercentage[0]?.attendancePercentage || 0.00}%</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>2° - {!!item?.rankingAttendancePercentage[1]?.attendancePercentage ? item?.rankingAttendancePercentage[1]?.className : ''}:</Text>
                  <Text style={styles.value}>{!isNaN(item?.rankingAttendancePercentage[1]?.attendancePercentage) && item?.rankingAttendancePercentage[1]?.attendancePercentage || 0.00}%</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>3° - {!!item?.rankingAttendancePercentage[2]?.attendancePercentage ? item?.rankingAttendancePercentage[2]?.className : ''}:</Text>
                  <Text style={styles.value}>{!isNaN(item?.rankingAttendancePercentage[2]?.attendancePercentage) && item?.rankingAttendancePercentage[2]?.attendancePercentage || 0.00}%</Text>
                </View>
                <Text style={styles.buttonText}>============================================</Text>
                <Text style={styles.title}>Vencedores em Ofertas</Text>
                {(
                  hasDuplicates(item?.rankingOffers.map((item) => item.offers))
                ) ? (
                  <Text style={{ color: '#b8af02', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                    {'> Houve Empate <'}
                  </Text>
                ) : null}
                <View style={styles.item}>
                  <Text style={styles.label}>1° - {!!Number(item?.rankingOffers[0]?.offers.replace(/[^\d]/g, '')) ? item?.rankingOffers[0]?.className : ''}:</Text>
                  <Text style={styles.value}>{formatToCurrency(item?.rankingOffers[0]?.offers || 0)}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>2° - {!!Number(item?.rankingOffers[1]?.offers.replace(/[^\d]/g, '')) ? item?.rankingOffers[1]?.className : ''}:</Text>
                  <Text style={styles.value}>{formatToCurrency(item?.rankingOffers[1]?.offers || 0)}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>3° - {!!Number(item?.rankingOffers[2]?.offers.replace(/[^\d]/g, '')) ? item?.rankingOffers[2]?.className : ''}:</Text>
                  <Text style={styles.value}>{formatToCurrency(item?.rankingOffers[2]?.offers || 0)}</Text>
                </View>
                <Text style={styles.buttonText}>============================================</Text>
                <Text style={styles.title}>Vencedores em Bíblias</Text>
                {(
                  hasDuplicates(item?.rankingBibles.map((item) => item.bibles))
                ) ? (
                  <Text style={{ color: '#b8af02', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                    {'> Houve Empate <'}
                  </Text>
                ) : null}
                <View style={styles.item}>
                  <Text style={styles.label}>1° - {!!item?.rankingBibles[0]?.bibles ? item?.rankingBibles[0]?.className : ''}:</Text>
                  <Text style={styles.value}>{item?.rankingBibles[0]?.bibles || 0}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>2° - {!!item?.rankingBibles[1]?.bibles ? item?.rankingBibles[1]?.className : ''}:</Text>
                  <Text style={styles.value}>{item?.rankingBibles[1]?.bibles || 0}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>3° - {!!item?.rankingBibles[2]?.bibles ? item?.rankingBibles[2]?.className : ''}:</Text>
                  <Text style={styles.value}>{item?.rankingBibles[2]?.bibles || 0}</Text>
                </View>
                <Text style={styles.buttonText}>============================================</Text>
                <Text style={styles.title}>Vencedores em Revistas</Text>
                {(
                  hasDuplicates(item?.rankingMagazines.map((item) => item.magazines))
                ) ? (
                  <Text style={{ color: '#b8af02', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                    {'> Houve Empate <'}
                  </Text>
                ) : null}
                <View style={styles.item}>
                  <Text style={styles.label}>1° - {!!item?.rankingMagazines[0]?.magazines ? item?.rankingMagazines[0]?.className : ''}:</Text>
                  <Text style={styles.value}>{item?.rankingMagazines[0]?.magazines || 0}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>2° - {!!item?.rankingMagazines[1]?.magazines ? item?.rankingMagazines[1]?.className : ''}:</Text>
                  <Text style={styles.value}>{item?.rankingMagazines[1]?.magazines || 0}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>3° - {!!item?.rankingMagazines[2]?.magazines ? item?.rankingMagazines[2]?.className : ''}:</Text>
                  <Text style={styles.value}>{item?.rankingMagazines[2]?.magazines || 0}</Text>
                </View>
                <Text style={styles.buttonText}>============================================</Text>
                <Text style={styles.title}>Vencedores em Visitantes</Text>
                {(
                  hasDuplicates(item?.rankingVisitors.map((item) => item.visitors))
                ) ? (
                  <Text style={{ color: '#b8af02', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                    {'> Houve Empate <'}
                  </Text>
                ) : null}
                <View style={styles.item}>
                  <Text style={styles.label}>1° - {!!item?.rankingVisitors[0]?.visitors ? item?.rankingVisitors[0]?.className : ''}:</Text>
                  <Text style={styles.value}>{item?.rankingVisitors[0]?.visitors || 0}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>2° - {!!item?.rankingVisitors[1]?.visitors ? item?.rankingVisitors[1]?.className : ''}:</Text>
                  <Text style={styles.value}>{item?.rankingVisitors[1]?.visitors || 0}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>3° - {!!item?.rankingVisitors[2]?.visitors ? item?.rankingVisitors[2]?.className : ''}:</Text>
                  <Text style={styles.value}>{item?.rankingVisitors[2]?.visitors || 0}</Text>
                </View>
                <Text style={styles.buttonText}>============================================</Text>
                <Text style={styles.buttonText}>============================================</Text>
              </>
            ) : null}
          </>

        )}
        keyExtractor={(item) => item?.className}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f2f2',
    marginTop: 50,
    marginBottom: 50,
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 16,
    color: '#333',
    alignSelf: 'center'
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 18,
    color: '#444',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  button2: { flexDirection: 'row', gap: 10 },
  button: {
    padding: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: '#C0C0C0',
    borderColor: 'gray',
    alignSelf: 'center'
  },
  present: { backgroundColor: '#c8facc', borderColor: '#38a169' },
  absent: { backgroundColor: '#fcdada', borderColor: '#e53e3e' },
  buttonText: { fontSize: 14 },
});
