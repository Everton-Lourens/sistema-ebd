import { NewCall } from '@/classes/newCall';
import { Student } from '@/classes/newStudent';
import { initialClasses } from '@/constants/ClassName';
import { formatToCurrency } from '@/helper/format';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import uuid from 'react-native-uuid';

export default function App() {
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
  const [initLoad, setInitLoad] = useState(true);
  const [name, setName] = useState('');
  const [popUpNewStudent, setPopUpNewStudent] = useState(false);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [totalCall, setTotalCall] = useState({
    totalStudent: 0,
    totalPresence: 0,
    totalBibleNumber: 0,
    totalMagazineNumber: 0,
    totalGuestNumber: 0,
    totalOffersNumber: 0,
  });

  const selectedClass = classes.find(c => c.id === selectedClassId);

  const showAlert = (message: string) => {
    if (Platform.OS !== 'web') {
      Alert.alert(message, '', [{ text: 'OK' }]);
    } else {
      window.alert(message);
    }
  };

  function updateAllClasses() {
    let totalStudent = 0;
    let totalPresence = 0;
    let totalBibleNumber = 0;
    let totalMagazineNumber = 0;
    let totalGuestNumber = 0;
    let totalOffersNumber = 0;
    const newCall = new NewCall();
    getStudentList();
    const promises = initialClasses.map(({ name }) => {
      newCall.className = name;
      return newCall.getCall(name).then(data => {
        if (data) {
          checkDate(data?.callDate);

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
      console.log('@@@@@@@@@@@@@@ FINALIZADO @@@@@@@@@@@@@@@@@@');
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

  const handleNewCall = (className = '') => {
    if (!className || !studentNumber || !presenceNumber || !bibleNumber || !magazineNumber || !guestNumber || !offersNumber)
      return showAlert('Preencha todos os campos');
    const newCall = new NewCall();
    newCall.setCall({
      className,
      studentNumber,
      presenceNumber,
      bibleNumber,
      magazineNumber,
      guestNumber,
      offersNumber,
    });
    newCall.save()
    updateAllClasses()
    showAlert('Salvo com sucesso');
  };

  const getStudentList = () => {
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    Student.getStudents(selectedClass.name)
      .then((students: Student[] | JSON) => {
        if (Array.isArray(students) && students.length === 0) return;
        setAllStudents(Array.isArray(students) ? students : Object.values(students));
        const studentNames = Array.isArray(students) ? students.map((student: Student) => student.name) : Object.values(students).map((student: Student) => student.name);
        if (studentNames.includes(name)) {
          return showAlert('Aluno já cadastrado!');
        }
      })
  }
  const addNewStudent = () => {
    try {
      Student.getStudents(selectedClass.name)
        .then((students: Student[] | JSON) => {
          const studentNames = Array.isArray(students) ? students.map((student: Student) => student.name) : Object.values(students).map((student: Student) => student.name);
          if (studentNames.includes(name)) {
            return showAlert('Aluno já cadastrado!');
          } else {
            const newStudent = {
              id: uuid.v4(),
              name,
              className: selectedClass.name,
            };
            const studentsList = Student.addStudent(newStudent);
            setAllStudents(Array.isArray(studentsList) ? studentsList : Object.values(studentsList));
            showAlert(`Aluno "${name}" adicionado a turma "${selectedClass.name}"!`);
            setName('');
            setPopUpNewStudent(false);
          }
        })
    } catch (error) {
      console.trace(error);
      return showAlert('Erro ao adicionar aluno');
    }
  }

  const isCalled = (className: string = ''): boolean => {
    if (className === '') throw new Error('O nome da turma é obrigatório');
    if (
      !allCall[className]?.studentNumber ||
      !allCall[className]?.presenceNumber ||
      !allCall[className]?.magazineNumber ||
      !allCall[className]?.bibleNumber ||
      !allCall[className]?.guestNumber ||
      !allCall[className]?.offersNumber
    ) {
      return false
    }
    return true
  }

  useEffect(() => {
    const totalPresence = Number(presenceNumber) + Number(guestNumber);
    const checkBibleNumber = Number(bibleNumber) > totalPresence;
    const checkMagazineNumber = Number(magazineNumber) > totalPresence;

    if (checkBibleNumber || checkMagazineNumber) {
      if (checkBibleNumber) setBibleNumber('');
      if (checkMagazineNumber) setMagazineNumber('');
      showAlert('Erro: Bíblias ou revistas maior que o número de presenças');
    }
  }, [presenceNumber, studentNumber, bibleNumber, magazineNumber, guestNumber, offersNumber]);

  useFocusEffect(
    useCallback(() => {
      updateAllClasses().finally(() => {
        console.log('Atualização finalizada');
      });
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedClass.name}</Text>
      {!selectedClassId ? (
        <>
          <Text style={styles.subtitle}>Chamada dos Alunos</Text>
          <FlatList
            data={classes}
            keyExtractor={item => item.id}
            extraData={allCall}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={isCalled(item.name) ? styles.classItem : styles.classItemNotCalled}
                onPress={() => setSelectedClassId(item.id)}
              >
                <Text style={styles.className}>{item.name}</Text>
                <Text style={styles.studentCount}>
                  {`${allCall[item.name]?.studentNumber || '--'} Cadastrado(s)`}
                </Text>
              </TouchableOpacity>
            )}
          />
        </>
      ) : (
        <>
          {popUpNewStudent && (
            <Modal visible={true} transparent animationType="slide">
              <View style={styles.overlay}>
                <View style={styles.containerPopUp}>
                  <Text style={styles.titlePopUp}>{selectedClass.name}</Text>
                  <TextInput
                    style={styles.inputPopUp}
                    placeholder="Nome do aluno"
                    value={name}
                    onChangeText={setName}
                  />
                  <View style={styles.buttonsPopUp}>
                    <Button title="Cancelar" onPress={() => { setPopUpNewStudent(false) }} />
                    <Button title="OK" onPress={() => { addNewStudent() }} />
                  </View>
                </View>
              </View>
            </Modal>
          )}
          <TouchableOpacity onPress={() => {
            setSelectedClassId(null)
            setStudentNumber('')
            setPresenceNumber('')
            setBibleNumber('')
            setMagazineNumber('')
            setGuestNumber('')
            setOffersNumber('')
          }}>
            <Text style={styles.back}>← Voltar</Text>
          </TouchableOpacity>
          <Button
            title="Adicionar Aluno"
            onPress={() => setPopUpNewStudent(true)}
          />

          <FlatList
            data={allStudents}
            keyExtractor={item => item?.id}
            extraData={allStudents}
            renderItem={({ item }) => (
              <View style={styles.studentItem}>
                <Text style={styles.studentName}>{item?.name}</Text>
                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={[styles.presenceButton, styles.present]}
                    onPress={() => {
                      // Handle presence logic here
                    }}
                  >
                    <Text style={styles.buttonText}>Presente</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.presenceButton, styles.absent]}
                    onPress={() => {
                      // Handle absence logic here
                    }}
                  >
                    <Text style={styles.buttonText}>Ausente</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantidade de Alunos"
            placeholderTextColor="gray"
            value={studentNumber}
            onChangeText={(text) => {
              const onlyNumbers = text.replace(/[^0-9]/g, '');
              setStudentNumber(onlyNumbers);
            }}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Quantidade de Presenças"
            placeholderTextColor="gray"
            value={presenceNumber}
            onChangeText={(text) => {
              const onlyNumbers = text.replace(/[^0-9]/g, '');
              setPresenceNumber(onlyNumbers);
            }}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Visitantes"
            placeholderTextColor="gray"
            value={guestNumber}
            onChangeText={(text) => {
              const onlyNumbers = text.replace(/[^0-9]/g, '');
              setGuestNumber(onlyNumbers);
            }}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Bílias"
            placeholderTextColor="gray"
            value={bibleNumber}
            onChangeText={(text) => {
              const onlyNumbers = text.replace(/[^0-9]/g, '');
              setBibleNumber(onlyNumbers);
              /*
              const onlyNumbers = text.replace(/[^0-9]/g, '');
              const presences = getNumberPresence(selectedClass)
              if (Number(onlyNumbers) <= presences)
                setBibleNumber(onlyNumbers);
              else
                setBibleNumber('');
              */
            }}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Revistas"
            placeholderTextColor="gray"
            value={magazineNumber}
            onChangeText={(text) => {
              const onlyNumbers = text.replace(/[^0-9]/g, '');
              setMagazineNumber(onlyNumbers);
            }}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Ofertas"
            placeholderTextColor="gray"
            value={offersNumber}
            onChangeText={(text) => {
              const onlyNumbers = text.replace(/[^0-9]/g, '');
              const formatted = formatToCurrency(onlyNumbers)
              setOffersNumber(formatted);
            }}
            keyboardType="numeric"
          />
          <Button
            title="Enviar"
            onPress={() => handleNewCall(selectedClass?.name)}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 10 },
  input: {
    borderWidth: 1, backgroundColor: 'white', borderColor: '#aaa', borderRadius: 5,
    padding: 10, marginBottom: 10,
  },
  classItem: {
    borderWidth: 1, padding: 10,
    borderRadius: 5, marginBottom: 10, backgroundColor: '#c8facc', borderColor: '#38a169'
  },
  classItemNotCalled: {
    borderWidth: 1, padding: 10,
    borderRadius: 5, marginBottom: 10, backgroundColor: '#fcdada', borderColor: '#e53e3e'
  },
  className: { fontSize: 16, fontWeight: 'bold' },
  studentCount: { fontSize: 12, color: '#555' },
  back: {
    color: '#007AFF', marginBottom: 10, fontSize: 16,
  },
  studentItem: {
    padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc',
  },
  studentName: { fontSize: 16, marginBottom: 5 },
  buttons: { flexDirection: 'row', gap: 10 },
  presenceButton: {
    padding: 6, paddingHorizontal: 12,
    borderWidth: 1, borderRadius: 5,
    borderColor: '#aaa',
  },
  present: { backgroundColor: '#c8facc', borderColor: '#38a169' },
  absent: { backgroundColor: '#fcdada', borderColor: '#e53e3e' },
  buttonText: { fontSize: 14 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000aa' },
  containerPopUp: { width: '80%', padding: 20, backgroundColor: '#fff', borderRadius: 10 },
  titlePopUp: { fontSize: 18, marginBottom: 10 },
  inputPopUp: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15 },
  buttonsPopUp: { flexDirection: 'row', justifyContent: 'space-between' },
});
