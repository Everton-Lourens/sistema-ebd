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
  const [classes, setClasses] = useState(initialClasses);
  const [allCall, setAllCall] = useState({
    studentNumber: '',
    presenceNumber: '',
    magazineNumber: '',
    bibleNumber: '',
    guestNumber: '',
    offersNumber: '',
  });
  const [presenceNumber, setPresenceNumber] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [bibleNumber, setBibleNumber] = useState('');
  const [magazineNumber, setMagazineNumber] = useState('');
  const [guestNumber, setGuestNumber] = useState('');
  const [offersNumber, setOffersNumber] = useState('');
  const [initLoad, setInitLoad] = useState(true);

  const [data, setData] = useState<DataItem[]>([]);
  const [totalCall, setTotalCall] = useState({
    totalStudent: 0,
    totalPresence: 0,
    totalBibleNumber: 0,
    totalMagazineNumber: 0,
    totalGuestNumber: 0,
    totalOffersNumber: 0,
  });

  useEffect(() => {
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

  }, [allCall]);

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

  const getPercentage = (presence: string = '', allStudents: string = ''): number => {
    if (!allStudents || !presence) return 0;
    return parseFloat(((Number(presence) / Number(allStudents)) * 100).toFixed(2));
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
    }, [])
  );

  const copiarResumoGeral = (item) => {
    const texto = `
Resumo ${item.title} - *${new Date().toLocaleDateString('pt-BR')}*

Total de Alunos: *${allCall[item.title]?.studentNumber || 0}*
Presentes: *${allCall[item.title]?.presenceNumber || 0}*
Ausentes: *${allCall[item.title]?.studentNumber - allCall[item.title]?.presenceNumber || 0}*
Bíblias: *${allCall[item.title]?.bibleNumber || 0}*
Revistas: *${allCall[item.title]?.magazineNumber || 0}*
Visitantes: *${allCall[item.title]?.guestNumber || 0}*
Ofertas: *${formatToCurrency(allCall[item.title]?.offersNumber || 0)}*
Porcentagem: *${getPercentage(allCall[item.title]?.presenceNumber || '', allCall[item.title]?.studentNumber || '') || 0}%*
  `.trim();

    Clipboard.setStringAsync(texto);
  };

  return (
    <>
      <View style={styles.container}>
    <FlatList
      data={data}
      style={styles.container}
      extraData={allCall}
      renderItem={({ item }) => (
        <>
          <Text style={styles.title}>{item?.title}</Text>
          <View style={styles.item}>
            <Text style={styles.label}>Matriculados:</Text>
            <Text style={styles.value}>{item?.studentNumber || 0}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Presentes:</Text>
            <Text style={styles.value}>{item?.presenceNumber || 0}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Ausentes:</Text>
            <Text style={styles.value}>{(Number(item?.studentNumber || 0) - Number(item?.presenceNumber || 0)) || 0}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Bíblias:</Text>
            <Text style={styles.value}>{item?.bibleNumber || 0}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Revistas:</Text>
            <Text style={styles.value}>{item?.magazineNumber || 0}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Visitantes:</Text>
            <Text style={styles.value}>{item?.guestNumber || 0}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Ofertas:</Text>
            <Text style={styles.value}>{formatToCurrency(item?.offersNumber || 0)}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Porcentagem:</Text>
            <Text style={styles.value}>{parseFloat(((item?.presenceNumber / item?.studentNumber) * 100).toFixed(2)) || 0}%</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => copiarResumoGeral(item)}>
            <Text style={styles.buttonText}>Copiar {item?.title}</Text>
          </TouchableOpacity>
          <Text style={styles.buttonText}>========================================</Text>
          <Text style={styles.buttonText}>========================================</Text>
        </>
      )}
      keyExtractor={(item) => item?.title}
    />
    </View>
    </>
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
