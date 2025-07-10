import { MyClass } from '@/classes/class';
import { NewCall } from '@/classes/newCall';
import { initialClasses } from '@/constants/ClassName';
import { formatToCurrency } from '@/helper/format';
import * as Clipboard from 'expo-clipboard';
import { useFocusEffect } from 'expo-router';
import { navigate } from 'expo-router/build/global-state/routing';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

const initCall = {
  studentNumber: '',
  presenceNumber: '',
  magazineNumber: '',
  bibleNumber: '',
  guestNumber: '',
  offersNumber: '',
}

const initTotalCall = {
  totalStudent: 0,
  totalPresence: 0,
  totalBibleNumber: 0,
  totalMagazineNumber: 0,
  totalGuestNumber: 0,
  totalOffersNumber: 0,
}

export default function Resumo() {
  const [resumo, setResumo] = useState(resumoInit);
  const [allCall, setAllCall] = useState(initCall);
  const [isLoading, setIsLoading] = useState(true);
  const [allStudents, setAllStudents] = useState<IDataSummary[]>([]);
  const [data, setData] = useState<DataItem[]>([]);
  const [totalCall, setTotalCall] = useState(initTotalCall);
  const [countStudents, setCountStudents] = useState(0);

  const getPartialReport = () => {
    setAllStudents([]);
    MyClass.getPartialReport()
      .then((dataSummary: any) => {
        if (Array.isArray(dataSummary) && dataSummary.length === 0) return;
        setAllStudents(Array.isArray(dataSummary) ? dataSummary : Object.values(dataSummary));
        setCountStudents(Object.values(dataSummary).length);
      })
  }

  useEffect(() => {
    setData([]);
    updateAllClasses()
  }, [isLoading]);

  useFocusEffect(
    useCallback(() => {
      setAllStudents([]);
      getPartialReport();
      return () => {
        setAllStudents([]);
      };
    }, [])
  );


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
          const isToday = checkDate(data?.callDate);
          if (!isToday) return console.log(`Data não é hoje: ${data?.callDate}`);

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
    });
  }

  function checkDate(oldDate = '') {
    let sameDate = false;
    if (!oldDate) {
      sameDate = false;
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
        setData([]);
        setAllCall(initCall);
        setTotalCall(initTotalCall);
        return false
      }
    }
    return sameDate;
  }
  const copiarResumo = (item: any) => {
    MyClass.getAllStudentsInClass(item?.className).then(data => {
      const alunosDaTurma = data?.[item.className] || []; // acessa o array

      const enrolled = Number(item?.enrolled) || 0;
      const present = Number(item?.present) || 0;
      const absent = Number(item?.absent) || 0;
      const visitors = Number(item?.visitors) || 0;
      const total = Number(item?.total) || 0;
      const bibles = Number(item?.bibles) || 0;
      const magazines = Number(item?.magazines) || 0;
      const offers = item?.offers || 'R$ 0,00';

      const percentage = !isNaN(present) && !isNaN(enrolled) && enrolled > 0
        ? ((present / enrolled) * 100).toFixed(2)
        : '0.00';

      const presentList = alunosDaTurma
        .map((aluno: any) => `- ${aluno.name}: ${aluno.present ? '*Presente*' : 'Falta'}`)
        .join('\n');

      const texto = `
Resumo ${item.className} - *${new Date().toLocaleDateString('pt-BR')}*

Matriculados: *${enrolled}*
Ausentes: *${absent}*
Presentes: *${present}*
Visitantes: *${visitors}*
Total: *${total}*
Bíblias: *${bibles}*
Revistas: *${magazines}*
Ofertas: *${offers}*
Porcentagem: *${percentage}%*

*Lista de Presença:*
${presentList}
    `.trim();

      Clipboard.setStringAsync(texto);
    });
  };


  return allStudents.length > 0 ? (
    <View style={styles.container}>
      <FlatList
        data={allStudents}
        style={styles.container}
        extraData={[allStudents]}
        renderItem={({ item, index }) => item?.present === 0 && !!item?.className ?
          (
            <>
              <Text style={styles.title}>{item?.className}{' '}</Text>
              <Text style={{ color: 'red', alignSelf: 'center' }}>(Classe sem presença)</Text>
              <Text style={styles.buttonText}>========================================</Text>
            </>
          )
          : (
            <>
              <Text style={styles.title}>{item?.className || ''}</Text>
              <View style={styles.item}>
                <Text style={styles.label}>Matriculados:</Text>
                <Text style={styles.value}>{item?.enrolled || 0}</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.label}>Ausentes:</Text>
                <Text style={styles.value}>{item?.absent}</Text>
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
                <Text style={styles.value}>{!isNaN(item?.attendancePercentage) && item?.attendancePercentage || 0.00}%</Text>
              </View>
              <TouchableOpacity style={styles.button} onPress={() => copiarResumo(item)}>
                <Text style={styles.buttonText}>Copiar: {item?.className}</Text>
              </TouchableOpacity>
              <Text style={styles.buttonText}>========================================</Text>
            </>
          )}
        keyExtractor={(item) => item?.className}
      />
    </View>
  ) : (
    <View style={{ backgroundColor: '#f2f2f2', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 20 }}>
        {'Faça a chamada de alguma classe\npara ver o histórico de chamadas'}
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigate('/')}>
        <Text style={styles.buttonText}>Fazer Chamada</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
    fontSize: 16,
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
