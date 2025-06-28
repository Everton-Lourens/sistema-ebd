import { NewCall } from '@/classes/newCall';
import { initialClasses } from '@/constants/ClassName';
import { compareDate } from '@/helper/date';
import { formatToCurrency } from '@/helper/format';
import * as Clipboard from 'expo-clipboard';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const resumoInit = {
  studentNumber: 0,
  presenceNumber: 0,
  bibleNumber: 0,
  magazineNumber: 0,
  guestNumber: 0,
  offersNumber: 0,
};

type DataItem = {
  title: string;
  className: string;
  studentNumber: string;
  presenceNumber: string;
  bibleNumber: string;
  magazineNumber: string;
  guestNumber: string;
  offersNumber: string;
};

export default function Resumo() {
  const [resumo, setResumo] = useState(resumoInit);
  const [allCall, setAllCall] = useState({
    studentNumber: '',
    presenceNumber: '',
    magazineNumber: '',
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
  const [totalCall, setTotalCall] = useState({
    totalStudent: 0,
    totalPresence: 0,
    totalBibleNumber: 0,
    totalMagazineNumber: 0,
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

  useEffect(() => {
    checkEmpateClasses();
  }, [data]);

  function checkEmpateClasses() {
    const checkDataEmpate = Object.values(allCall).filter(item => Object.values(item).some(value => value !== ""));
    if (checkDataEmpate.length === 0) return;
    // Cálculo dos rankings
    const dataComPorcentagem = checkDataEmpate.map((item: any) => ({
      ...item,
      porcentagem: getPercentage(item?.presenceNumber, item?.studentNumber) || 0,
      ofertas: Number(item?.offersNumber?.replace(/[^\d]/g, '') || 0),
    }));

    const gerarTop3 = (data: any[], campo: string) => {
      return [...data]
        .sort((a, b) => (b[campo] ?? 0) - (a[campo] ?? 0))
        .slice(0, 3)
        .map((item, index) => ({
          ...item,
          colocacao:
            index === 0
              ? '1º Lugar'
              : index === 1
                ? '2º Lugar'
                : '3º Lugar',
        }));
    };
    setTopPresencas(gerarTop3(dataComPorcentagem, 'porcentagem'));
    setTopOfertas(gerarTop3(dataComPorcentagem, 'ofertas'));
    setTopBiblias(gerarTop3(dataComPorcentagem, 'bibleNumber'));
    setTopRevistas(gerarTop3(dataComPorcentagem, 'magazineNumber'));
    setTopVisitantes(gerarTop3(dataComPorcentagem, 'guestNumber'));
  }
console.log(JSON.stringify(topPresencas, null, 2));
  useEffect(() => {
    setEmpatePresenca(
      (Number(topPresencas[0]?.porcentagem) > 0 &&
        Number(topPresencas[1]?.porcentagem) > 0 &&
        Number(topPresencas[0]?.porcentagem) === Number(topPresencas[1]?.porcentagem)) ||
      (Number(topPresencas[0]?.porcentagem) > 0 &&
        Number(topPresencas[2]?.porcentagem) > 0 &&
        Number(topPresencas[0]?.porcentagem) === Number(topPresencas[2]?.porcentagem)) ||
      (Number(topPresencas[1]?.porcentagem) > 0 &&
        Number(topPresencas[2]?.porcentagem) > 0 &&
        Number(topPresencas[1]?.porcentagem) === Number(topPresencas[2]?.porcentagem))
    );
    setEmpatePresenca(
      (Number(topPresencas[0]?.porcentagem) > 0 &&
        Number(topPresencas[1]?.porcentagem) > 0 &&
        Number(topPresencas[0]?.porcentagem) === Number(topPresencas[1]?.porcentagem)) ||
      (Number(topPresencas[0]?.porcentagem) > 0 &&
        Number(topPresencas[2]?.porcentagem) > 0 &&
        Number(topPresencas[0]?.porcentagem) === Number(topPresencas[2]?.porcentagem)) ||
      (Number(topPresencas[1]?.porcentagem) > 0 &&
        Number(topPresencas[2]?.porcentagem) > 0 &&
        Number(topPresencas[1]?.porcentagem) === Number(topPresencas[2]?.porcentagem))
    );
    setEmpateOfertas(
      (Number(topOfertas[0]?.ofertas) > 0 &&
        Number(topOfertas[1]?.ofertas) > 0 &&
        Number(topOfertas[0]?.ofertas) === Number(topOfertas[1]?.ofertas)) ||
      (Number(topOfertas[0]?.ofertas) > 0 &&
        Number(topOfertas[2]?.ofertas) > 0 &&
        Number(topOfertas[0]?.ofertas) === Number(topOfertas[2]?.ofertas)) ||
      (Number(topOfertas[1]?.ofertas) > 0 &&
        Number(topOfertas[2]?.ofertas) > 0 &&
        Number(topOfertas[1]?.ofertas) === Number(topOfertas[2]?.ofertas))
    );
    setEmpateBiblias(
      (Number(topBiblias[0]?.bibleNumber) > 0 &&
        Number(topBiblias[1]?.bibleNumber) > 0 &&
        Number(topBiblias[0]?.bibleNumber) === Number(topBiblias[1]?.bibleNumber)) ||
      (Number(topBiblias[0]?.bibleNumber) > 0 &&
        Number(topBiblias[2]?.bibleNumber) > 0 &&
        Number(topBiblias[0]?.bibleNumber) === Number(topBiblias[2]?.bibleNumber)) ||
      (Number(topBiblias[1]?.bibleNumber) > 0 &&
        Number(topBiblias[2]?.bibleNumber) > 0 &&
        Number(topBiblias[1]?.bibleNumber) === Number(topBiblias[2]?.bibleNumber))
    );
    setEmpateRevistas(
      (Number(topRevistas[0]?.magazineNumber) > 0 &&
        Number(topRevistas[1]?.magazineNumber) > 0 &&
        Number(topRevistas[0]?.magazineNumber) === Number(topRevistas[1]?.magazineNumber)) ||
      (Number(topRevistas[0]?.magazineNumber) > 0 &&
        Number(topRevistas[2]?.magazineNumber) > 0 &&
        Number(topRevistas[0]?.magazineNumber) === Number(topRevistas[2]?.magazineNumber)) ||
      (Number(topRevistas[1]?.magazineNumber) > 0 &&
        Number(topRevistas[2]?.magazineNumber) > 0 &&
        Number(topRevistas[1]?.magazineNumber) === Number(topRevistas[2]?.magazineNumber))
    );
    setEmpateVisitantes(
      (Number(topVisitantes[0]?.guestNumber) > 0 &&
        Number(topVisitantes[1]?.guestNumber) > 0 &&
        Number(topVisitantes[0]?.guestNumber) === Number(topVisitantes[1]?.guestNumber)) ||
      (Number(topVisitantes[0]?.guestNumber) > 0 &&
        Number(topVisitantes[2]?.guestNumber) > 0 &&
        Number(topVisitantes[0]?.guestNumber) === Number(topVisitantes[2]?.guestNumber)) ||
      (Number(topVisitantes[1]?.guestNumber) > 0 &&
        Number(topVisitantes[2]?.guestNumber) > 0 &&
        Number(topVisitantes[1]?.guestNumber) === Number(topVisitantes[2]?.guestNumber))
    );
  }, [topPresencas, topOfertas, topBiblias, topRevistas, topVisitantes]);

  function updateAllClasses() {
    let totalStudent = 0;
    let totalPresence = 0;
    let totalBibleNumber = 0;
    let totalMagazineNumber = 0;
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
          totalMagazineNumber += Number(data?.magazineNumber) || 0;
          totalGuestNumber += Number(data?.guestNumber) || 0;
          totalOffersNumber += Number(data?.offersNumber?.replace(/[^\d]/g, '')) || 0;

          setTotalCall({
            totalStudent,
            totalPresence,
            totalBibleNumber,
            totalMagazineNumber,
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
              magazineNumber: data?.magazineNumber || '',
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
                magazineNumber: data?.magazineNumber || '',
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
      newCall.magazineNumber = totalMagazineNumber.toString();
      newCall.guestNumber = totalGuestNumber.toString();
      newCall.offersNumber = totalOffersNumber.toString();
      newCall.save();
      setDataGeral([{
        title: 'Total Geral',
        studentNumber: totalStudent.toString(),
        presenceNumber: totalPresence.toString(),
        bibleNumber: totalBibleNumber.toString(),
        magazineNumber: totalMagazineNumber.toString(),
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


  const copiarResumoGeral = () => {
    const texto = `
Resumo - *${new Date().toLocaleDateString('pt-BR')}*

*=======================*
Total Geral:
Total de Alunos: *${resumo.studentNumber || ''}*
Presentes: *${resumo.presenceNumber || ''}*
Ausentes: *${resumo.studentNumber - resumo.presenceNumber || ''}*
Bíblias: *${resumo.bibleNumber || ''}*
Revistas: *${resumo.magazineNumber || ''}*
Visitantes: *${resumo.guestNumber || ''}*
Ofertas: *${formatToCurrency(resumo.offersNumber)}*
Porcentagem Geral: *${parseFloat(((resumo.presenceNumber / resumo.studentNumber) * 100).toFixed(2)) || 0}%*
*=======================*

Vencedores em Presença: ${empatePresenca ? '\n*> HOUVE EMPATE <*' : ''}
1° - *${topPresencas[0]?.className || ''}*: *${topPresencas[0]?.porcentagem || 0}%*
2° - *${topPresencas[1]?.className || ''}*: *${topPresencas[1]?.porcentagem || 0}%*
3° - *${topPresencas[2]?.className || ''}*: *${topPresencas[2]?.porcentagem || 0}%*
*=======================*

Vencedores em Ofertas: ${empateOfertas ? '\n*> HOUVE EMPATE <*' : ''}
1° - *${topOfertas[0]?.className || ''}*: *${formatToCurrency(topOfertas[0]?.ofertas || 0)}*
2° - *${topOfertas[1]?.className || ''}*: *${formatToCurrency(topOfertas[1]?.ofertas || 0)}*
3° - *${topOfertas[2]?.className || ''}*: *${formatToCurrency(topOfertas[2]?.ofertas || 0)}*
*=======================*

Vencedores em Bíblias: ${empateBiblias ? '\n*> HOUVE EMPATE <*' : ''}
1° - *${topBiblias[0]?.className || ''}*: *${topBiblias[0]?.bibleNumber || ''}*
2° - *${topBiblias[1]?.className || ''}*: *${topBiblias[1]?.bibleNumber || ''}*
3° - *${topBiblias[2]?.className || ''}*: *${topBiblias[2]?.bibleNumber || ''}*
*=======================*

Vencedores em Revistas: ${empateRevistas ? '\n*> HOUVE EMPATE <*' : ''}
1° - *${topRevistas[0]?.className || ''}*: *${topRevistas[0]?.magazineNumber || ''}*
2° - *${topRevistas[1]?.className || ''}*: *${topRevistas[1]?.magazineNumber || ''}*
3° - *${topRevistas[2]?.className || ''}*: *${topRevistas[2]?.magazineNumber || ''}*
*=======================*

Vencedores em Visitantes: ${empateVisitantes ? '\n*> HOUVE EMPATE <*' : ''}
1° - *${topVisitantes[0]?.className || ''}*: *${topVisitantes[0]?.guestNumber || ''}*
2° - *${topVisitantes[1]?.className || ''}*: *${topVisitantes[1]?.guestNumber || ''}*
3° - *${topVisitantes[2]?.className || ''}*: *${topVisitantes[2]?.guestNumber || ''}*
  `.trim();

    Clipboard.setStringAsync(texto);
  };

  return (
    <>
      <FlatList
        data={dataGeral}
        style={styles.container}
        extraData={[allCall, data, dataGeral]}
        renderItem={({ item }) => (
          <>
            <Text style={styles.title}>{item?.className}</Text>
            <View style={styles.item}>
              <Text style={styles.label}>Total de Alunos:</Text>
              <Text style={styles.value}>{item?.studentNumber}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>Presentes:</Text>
              <Text style={styles.value}>{item?.presenceNumber}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>Ausentes:</Text>
              <Text style={styles.value}>{Number(item?.studentNumber || 0) - Number(item?.presenceNumber || 0)}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>Bíblias:</Text>
              <Text style={styles.value}>{item?.bibleNumber}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>Revistas:</Text>
              <Text style={styles.value}>{item?.magazineNumber}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>Visitantes:</Text>
              <Text style={styles.value}>{item?.guestNumber}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>Ofertas:</Text>
              <Text style={styles.value}>{formatToCurrency(item?.offersNumber || 0)}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>Porcentagem:</Text>
              <Text style={styles.value}>{parseFloat(((item?.presenceNumber / item?.studentNumber) * 100).toFixed(2)) || 0}%</Text>
            </View>
            {dataGeral.length > 0 ? (
              <>


                <TouchableOpacity style={styles.button} onPress={copiarResumoGeral}>
                  <Text style={styles.buttonText}>Copiar Resumo {item?.className}</Text>
                </TouchableOpacity>
                <Text style={styles.buttonText}>============================================</Text>
                <Text style={styles.buttonText}>============================================</Text>
                <Text style={styles.title}>Vencedores em Presença</Text>
                {(
                  empatePresenca
                ) ? (
                  <Text style={{ color: '#b8af02', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                    {'> Houve Empate <'}
                  </Text>
                ) : null}
                <View style={styles.item}>
                  <Text style={styles.label}>1° - {topPresencas[0]?.className}:</Text>
                  <Text style={styles.value}>{topPresencas[0]?.porcentagem || 0}%</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>2° - {topPresencas[1]?.className}:</Text>
                  <Text style={styles.value}>{topPresencas[1]?.porcentagem || 0}%</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>3° - {topPresencas[2]?.className}:</Text>
                  <Text style={styles.value}>{topPresencas[2]?.porcentagem || 0}%</Text>
                </View>
                <Text style={styles.buttonText}>============================================</Text>
                <Text style={styles.title}>Vencedores em Ofertas</Text>
                {(
                  empateOfertas
                ) ? (
                  <Text style={{ color: '#b8af02', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                    {'> Houve Empate <'}
                  </Text>
                ) : null}
                <View style={styles.item}>
                  <Text style={styles.label}>1° - {topOfertas[0]?.className}:</Text>
                  <Text style={styles.value}>{formatToCurrency(topOfertas[0]?.ofertas || 0)}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>2° - {topOfertas[1]?.className}:</Text>
                  <Text style={styles.value}>{formatToCurrency(topOfertas[1]?.ofertas || 0)}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>3° - {topOfertas[2]?.className}:</Text>
                  <Text style={styles.value}>{formatToCurrency(topOfertas[2]?.ofertas || 0)}</Text>
                </View>
                <Text style={styles.buttonText}>============================================</Text>
                <Text style={styles.title}>Vencedores em Bíblias</Text>
                {(
                  empateBiblias
                ) ? (
                  <Text style={{ color: '#b8af02', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                    {'> Houve Empate <'}
                  </Text>
                ) : null}
                <View style={styles.item}>
                  <Text style={styles.label}>1° - {topBiblias[0]?.className}:</Text>
                  <Text style={styles.value}>{topBiblias[0]?.bibleNumber}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>2° - {topBiblias[1]?.className}:</Text>
                  <Text style={styles.value}>{topBiblias[1]?.bibleNumber}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>3° - {topBiblias[2]?.className}:</Text>
                  <Text style={styles.value}>{topBiblias[2]?.bibleNumber}</Text>
                </View>
                <Text style={styles.buttonText}>============================================</Text>
                <Text style={styles.title}>Vencedores em Revistas</Text>
                {(
                  empateRevistas
                ) ? (
                  <Text style={{ color: '#b8af02', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                    {'> Houve Empate <'}
                  </Text>
                ) : null}
                <View style={styles.item}>
                  <Text style={styles.label}>1° - {topRevistas[0]?.className}:</Text>
                  <Text style={styles.value}>{topRevistas[0]?.magazineNumber}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>2° - {topRevistas[1]?.className}:</Text>
                  <Text style={styles.value}>{topRevistas[1]?.magazineNumber}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>3° - {topRevistas[2]?.className}:</Text>
                  <Text style={styles.value}>{topRevistas[2]?.magazineNumber}</Text>
                </View>
                <Text style={styles.buttonText}>============================================</Text>
                <Text style={styles.title}>Vencedores em Visitantes</Text>
                {(
                  empateVisitantes
                ) ? (
                  <Text style={{ color: '#b8af02', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                    {'> Houve Empate <'}
                  </Text>
                ) : null}
                <View style={styles.item}>
                  <Text style={styles.label}>1° - {topVisitantes[0]?.className}:</Text>
                  <Text style={styles.value}>{topVisitantes[0]?.guestNumber}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>2° - {topVisitantes[1]?.className}:</Text>
                  <Text style={styles.value}>{topVisitantes[1]?.guestNumber}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>3° - {topVisitantes[2]?.className}:</Text>
                  <Text style={styles.value}>{topVisitantes[2]?.guestNumber}</Text>
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
