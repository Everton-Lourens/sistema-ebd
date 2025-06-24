import { NewCall } from '@/classes/newCall';
import { initialClasses } from '@/constants/ClassName';
import { compareDate } from '@/helper/date';
import { formatToCurrency } from '@/helper/format';
import * as Clipboard from 'expo-clipboard';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
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
  const [classes, setClasses] = useState(initialClasses);
  const [allCall, setAllCall] = useState({
    studentNumber: '',
    presenceNumber: '',
    magazineNumber: '',
    bibleNumber: '',
    guestNumber: '',
    offersNumber: '',
  });
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [newCallAlert, setNewCallAlert] = useState(false);
  const [presenceNumber, setPresenceNumber] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [bibleNumber, setBibleNumber] = useState('');
  const [magazineNumber, setMagazineNumber] = useState('');
  const [guestNumber, setGuestNumber] = useState('');
  const [offersNumber, setOffersNumber] = useState('');
  const [topPresencas, setTopPresencas] = useState([]);
  const [topOfertas, setTopOfertas] = useState([]);
  const [topBiblias, setTopBiblias] = useState([]);
  const [topRevistas, setTopRevistas] = useState([]);
  const [topVisitantes, setTopVisitantes] = useState([]);
  const [data, setData] = useState<DataItem[]>([]);
  const [initLoad, setInitLoad] = useState(true);
  const [totalCall, setTotalCall] = useState({
    totalStudent: 0,
    totalPresence: 0,
    totalBibleNumber: 0,
    totalMagazineNumber: 0,
    totalGuestNumber: 0,
    totalOffersNumber: 0,
  });

  useFocusEffect(
    useCallback(() => {
      updateAllClasses()
      const newCall = new NewCall();
      newCall.className = 'TOTAL_GERAL';
      newCall.studentNumber = totalCall.totalStudent.toString();
      newCall.presenceNumber = totalCall.totalPresence.toString();
      newCall.bibleNumber = totalCall.totalBibleNumber.toString();
      newCall.magazineNumber = totalCall.totalMagazineNumber.toString();
      newCall.guestNumber = totalCall.totalGuestNumber.toString();
      newCall.offersNumber = totalCall.totalOffersNumber.toString();
      newCall.save();
      console.log('@@@@@@@@@@@@@@@ 2 @@@@@@@@@@@@@');
    }, [])
  );
  const getPercentage = (presence: string = '', allStudents: string = ''): number => {
    if (!allStudents || !presence) return 0;
    return parseFloat(((Number(presence) / Number(allStudents)) * 100).toFixed(2));
  }
  function updateAllClasses() {
    let totalStudent = 0;
    let totalPresence = 0;
    let totalBibleNumber = 0;
    let totalMagazineNumber = 0;
    let totalGuestNumber = 0;
    let totalOffersNumber = 0;
    const newCall = new NewCall();
    initialClasses.forEach(({ name }) => {
      newCall.getCall(name).then(data => {
        if (data) {
          checkDate(data?.callDate)
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
          })
          setAllCall(prev => {
            return {
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
            }
          });
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

            // remove duplicate objects
            const uniqueData = newData.filter((item, index) => newData.findIndex(i => i.className === item.className) === index);

            return uniqueData;
          });
        }
      })
    });

  }

  function checkDate(oldDate: string) {
    if (initLoad) {
      setInitLoad(false)
      const date1 = new Date().toISOString();
      const date2 = new Date(oldDate).toISOString();
      function getDateOnly(isoString: string) {
        return isoString.split('T')[0];
      }
      const sameDate = getDateOnly(date1) === getDateOnly(date2);
      if (sameDate) {
        setStudentNumber('');
        setPresenceNumber('');
        setBibleNumber('');
        setMagazineNumber('');
        setGuestNumber('');
        setOffersNumber('');
        return true
      }
      return false
    }
  }

  const getTotalGeral = () => {
    const newCall = new NewCall();
    newCall.getCall('TOTAL_GERAL').then((result: any) => {
      if (result) {
        const sameDate = compareDate(result.callDate);
        if (sameDate) setResumo(result);
        else setResumo(resumoInit);
      }
    })
  }

  useFocusEffect(
    useCallback(() => {
      getTotalGeral();
      // Cálculo dos rankings
      const dataComPorcentagem = data.map((item) => ({
        ...item,
        porcentagem: getPercentage(item?.presenceNumber, item?.studentNumber),
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

      console.log(JSON.stringify(topPresencas, null, 2));
      console.log(topPresencas.map((item) => `\n${item.colocacao} - ${item.title} - Presenças: ${item.porcentagem}%`).join('\n'));
      console.log(topOfertas.map((item) => `\n${item.colocacao} - ${item.title} - Ofertas: ${item.ofertas.toLocaleString('pt-BR')}`).join('\n'));
      console.log(topBiblias.map((item) => `\n${item.colocacao} - ${item.title} - Bíblias: ${item.bibleNumber}`).join('\n'));
      console.log(topRevistas.map((item) => `\n${item.colocacao} - ${item.title} - Revistas: ${item.magazineNumber}`).join('\n'));
      console.log(topVisitantes.map((item) => `\n${item.colocacao} - ${item.title} - Visitantes: ${item.guestNumber}`).join('\n'));

    }, [])
  );


  const copiarResumoGeral = () => {
    const texto = `
Resumo Geral - *${new Date().toLocaleDateString('pt-BR')}*

Total de Alunos: *${resumo.studentNumber}*
Presentes: *${resumo.presenceNumber}*
Ausentes: *${resumo.studentNumber - resumo.presenceNumber}*
Bíblias: *${resumo.bibleNumber}*
Revistas: *${resumo.magazineNumber}*
Visitantes: *${resumo.guestNumber}*
Ofertas: *${formatToCurrency(resumo.offersNumber)}*
Porcentagem Geral: *${parseFloat(((resumo.presenceNumber / resumo.studentNumber) * 100).toFixed(2)) || 0}%*
  `.trim();

    Clipboard.setStringAsync(texto);
  };


  const dataGeral = [
    { title: 'Geral', ...resumo },
  ];

  return (
    <>
      <FlatList
        data={dataGeral}
        style={styles.container}
        extraData={allCall}
        renderItem={({ item }) => (
          <>
                <TouchableOpacity style={[{ marginTop: 50 }, styles.button]} onPress={updateAllClasses}>
        <Text style={styles.buttonText}>Atualizar</Text>
      </TouchableOpacity>
            <Text style={styles.title}>{item?.title}</Text>
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
            <TouchableOpacity style={styles.button} onPress={copiarResumoGeral}>
              <Text style={styles.buttonText}>Copiar Resumo {item?.title}</Text>
            </TouchableOpacity>
            <Text style={styles.buttonText}>============================================</Text>
            <Text style={styles.buttonText}>============================================</Text>
            <Text style={styles.title}>Vencedores em Presença</Text>
            {(
              topPresencas[0]?.porcentagem === topPresencas[1]?.porcentagem ||
              topPresencas[0]?.porcentagem === topPresencas[2]?.porcentagem ||
              topPresencas[1]?.porcentagem === topPresencas[2]?.porcentagem
            ) ? (
              <Text style={{ color: '#b8af02', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                Houve Empate
              </Text>
            ) : null}
            <View style={styles.item}>
              <Text style={styles.label}>1° - {topPresencas[0]?.title}:</Text>
              <Text style={styles.value}>{topPresencas[0]?.porcentagem}%</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>2° - {topPresencas[1]?.title}:</Text>
              <Text style={styles.value}>{topPresencas[1]?.porcentagem}%</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>3° - {topPresencas[2]?.title}:</Text>
              <Text style={styles.value}>{topPresencas[2]?.porcentagem}%</Text>
            </View>
            <Text style={styles.buttonText}>============================================</Text>
            <Text style={styles.title}>Vencedores em Ofertas</Text>
            {(
              topOfertas[0]?.ofertas === topOfertas[1]?.ofertas ||
              topOfertas[0]?.ofertas === topOfertas[2]?.ofertas ||
              topOfertas[1]?.ofertas === topOfertas[2]?.ofertas
            ) ? (
              <Text style={{ color: '#b8af02', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                Houve Empate
              </Text>
            ) : null}
            <View style={styles.item}>
              <Text style={styles.label}>1° - {topOfertas[0]?.title}:</Text>
              <Text style={styles.value}>{formatToCurrency(topOfertas[0]?.ofertas || 0)}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>2° - {topOfertas[1]?.title}:</Text>
              <Text style={styles.value}>{formatToCurrency(topOfertas[1]?.ofertas || 0)}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>3° - {topOfertas[2]?.title}:</Text>
              <Text style={styles.value}>{formatToCurrency(topOfertas[2]?.ofertas || 0)}</Text>
            </View>
            <Text style={styles.buttonText}>============================================</Text>
            <Text style={styles.title}>Vencedores em Bíblias</Text>
            {(
              topBiblias[0]?.bibleNumber === topBiblias[1]?.bibleNumber ||
              topBiblias[0]?.bibleNumber === topBiblias[2]?.bibleNumber ||
              topBiblias[1]?.bibleNumber === topBiblias[2]?.bibleNumber
            ) ? (
              <Text style={{ color: '#b8af02', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                Houve Empate
              </Text>
            ) : null}
            <View style={styles.item}>
              <Text style={styles.label}>1° - {topBiblias[0]?.title}:</Text>
              <Text style={styles.value}>{topBiblias[0]?.bibleNumber}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>2° - {topBiblias[1]?.title}:</Text>
              <Text style={styles.value}>{topBiblias[1]?.bibleNumber}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>3° - {topBiblias[2]?.title}:</Text>
              <Text style={styles.value}>{topBiblias[2]?.bibleNumber}</Text>
            </View>
            <Text style={styles.buttonText}>============================================</Text>
            <Text style={styles.title}>Vencedores em Revistas</Text>
            {(
              topRevistas[0]?.magazineNumber === topRevistas[1]?.magazineNumber ||
              topRevistas[0]?.magazineNumber === topRevistas[2]?.magazineNumber ||
              topRevistas[1]?.magazineNumber === topRevistas[2]?.magazineNumber
            ) ? (
              <Text style={{ color: '#b8af02', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                Houve Empate
              </Text>
            ) : null}
            <View style={styles.item}>
              <Text style={styles.label}>1° - {topRevistas[0]?.title}:</Text>
              <Text style={styles.value}>{topRevistas[0]?.magazineNumber}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>2° - {topRevistas[1]?.title}:</Text>
              <Text style={styles.value}>{topRevistas[1]?.magazineNumber}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>3° - {topRevistas[2]?.title}:</Text>
              <Text style={styles.value}>{topRevistas[2]?.magazineNumber}</Text>
            </View>
            <Text style={styles.buttonText}>============================================</Text>
            <Text style={styles.title}>Vencedores em Visitantes</Text>
            {(
              topVisitantes[0]?.guestNumber === topVisitantes[1]?.guestNumber ||
              topVisitantes[0]?.guestNumber === topVisitantes[2]?.guestNumber ||
              topVisitantes[1]?.guestNumber === topVisitantes[2]?.guestNumber
            ) ? (
              <Text style={{ color: '#b8af02', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                Houve Empate
              </Text>
            ) : null}
            <View style={styles.item}>
              <Text style={styles.label}>1° - {topVisitantes[0]?.title}:</Text>
              <Text style={styles.value}>{topVisitantes[0]?.guestNumber}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>2° - {topVisitantes[1]?.title}:</Text>
              <Text style={styles.value}>{topVisitantes[1]?.guestNumber}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>3° - {topVisitantes[2]?.title}:</Text>
              <Text style={styles.value}>{topVisitantes[2]?.guestNumber}</Text>
            </View>
            <Text style={styles.buttonText}>============================================</Text>
            <Text style={styles.buttonText}>============================================</Text>
          </>

        )}
        keyExtractor={(item) => item?.title}
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
