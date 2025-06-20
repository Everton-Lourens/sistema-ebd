import { NewCall } from '@/classes/newCall';
import { formatToCurrency } from '@/helper/format';
import React, { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const initialClasses = [
  'Cordeirinhos de Cristo',
  'Shalom',
  'Filhos de Asáfe',
  'Mensageiros de Cristo',
  'Rosa de Saron',
  'Filhos de Sião',
].map((name, index) => ({
  id: index.toString(),
  name,
  students: [], // { name: string, presence: 'P' | 'F' | null }
}));

export default function App() {
  const [classes, setClasses] = useState(initialClasses);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [newStudentName, setNewStudentName] = useState('');
  const [numberPresence, setNumberPresence] = useState(0);
  const [bibleNumber, setBibleNumber] = useState('');
  const [magazineNumber, setMagazineNumber] = useState('');
  const [guestNumber, setGuestNumber] = useState('');
  const [offersNumber, setOffersNumber] = useState('');
  const [callStudents, setCallStudents] = useState({});
  const [callStudents2, setCallStudents2] = useState({});

  const selectedClass = classes.find(c => c.id === selectedClassId);



  useEffect(() => {
    const getCall = async () => {
      const newCall = new NewCall();
      const call1 = await newCall.getCall('Cordeirinhos de Cristo');
      const call2 = await newCall.getCall('Shalom');
      const call3 = await newCall.getCall('Filhos de Asáfe');
      const call4 = await newCall.getCall('Mensageiros de Cristo');
      const call5 = await newCall.getCall('Rosa de Saron');
      const call6 = await newCall.getCall('Filhos de Sião');
      setCallStudents2({
        'Cordeirinhos': call1,
        'Shalom': call2,
        'Filhos de Asáfe': call3,
        'Mensageiros de Cristo': call4,
        'Rosa de Saron': call5,
        'Filhos de Sião': call6,
      });
    };
    getCall();
  }, [callStudents]);

  const handleAddStudent = () => {
    if (!newStudentName.trim()) return;
    const updated = classes.map(c => {
      if (c.id === selectedClassId) {
        return {
          ...c,
          students: [
            ...c.students,
            { name: newStudentName.trim(), presence: 'P' },
          ],
        };
      }
      return c;
    });
    setClasses(updated);
    setNewStudentName('');
  };
  const handleNewCall = () => {
    const newCall = new NewCall(
      'Cordeirinhos de Cristo',
      Number(numberPresence),
      Number(bibleNumber),
      Number(magazineNumber),
      Number(guestNumber),
      Number(offersNumber)
    )
    newCall.save('Cordeirinhos de Cristo')
    console.log(newCall.getCall('Cordeirinhos de Cristo'))
    setCallStudents(newCall)
  };
  const handleTogglePresence = (studentIndex, type) => {
    const updated = classes.map(c => {
      if (c.id === selectedClassId) {
        const students = [...c.students];
        students[studentIndex].presence = type;
        return { ...c, students };
      }
      return c;
    });
    setClasses(updated);
  };
  const handleToggleDelete = (studentIndex) => {
    const updated = classes.map(c => {
      if (c.id === selectedClassId) {
        const students = c.students.filter((_, i) => i !== studentIndex);
        return { ...c, students };
      }
      return c;
    });
    setClasses(updated);
  };

  const getNumberPresence = (item) => {
    const allPresence = classes
      .filter(c => c.id === item.id)
      .map(c => c.students.filter(student => student.presence === 'P').length)
      .reduce((acc, count) => acc + count, 0)
    setNumberPresence(allPresence)
    return allPresence
  }
  const getPercentage = (presence: number = 0, allStudents: number = 0): number => {
    if (allStudents === 0 || presence === 0) return 0;
    return parseFloat(((presence / allStudents) * 100).toFixed(2));
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle de Presença</Text>

      {!selectedClassId ? (
        <>
          <Text style={styles.subtitle}>Chamada dos Alunos: {JSON.stringify(callStudents2[0] || [])}</Text>
          <FlatList
            data={classes}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.classItem}
                onPress={() => setSelectedClassId(item.id)}
              >
                <Text style={styles.className}>{item.name}</Text>
                <Text style={styles.studentCount}>
                  {`${item.students.length} Cadastrado(s)  /  `}
                  {`${getNumberPresence(item)} Presente(s)  /  `}
                  {`${Number(magazineNumber)} Revista(s)  /  `}
                  {`${Number(bibleNumber)} Bíblia(s)  /  `}
                  {`${Number(guestNumber)} Convidado(s)  /  `}
                  {`${offersNumber} Oferta(s)  /  `}
                  {`${getPercentage(getNumberPresence(item), item.students.length) || 0.00}%`}
                </Text>
              </TouchableOpacity>
            )}
          />
        </>
      ) : (
        <>
          <TouchableOpacity onPress={() => setSelectedClassId(null)}>
            <Text style={styles.back}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.subtitle}>Alunos da turma: {selectedClass.name}</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome do Aluno"
            value={newStudentName}
            onChangeText={setNewStudentName}
          />
          <Button title="Adicionar" onPress={handleAddStudent} />

          <FlatList
            data={
              // @ts-ignore
              selectedClass.students}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.studentItem}>
                <Text style={styles.studentName}>{item.name}</Text>
                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={[
                      styles.presenceButton,
                      item.presence === 'P' && styles.present,
                    ]}
                    onPress={() => handleTogglePresence(index, 'P')}
                  >
                    <Text style={styles.buttonText}>Presente</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.presenceButton,
                      item.presence === 'F' && styles.absent,
                    ]}
                    onPress={() => handleTogglePresence(index, 'F')}
                  >
                    <Text style={styles.buttonText}>Falta</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.presenceButton,
                      styles.absent,
                      {
                        alignSelf: 'flex-end',
                        position: 'absolute',
                        right: 0,
                      },
                    ]}
                    onPress={() => handleToggleDelete(index)}
                  >
                    <Text style={styles.buttonText}>Remover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          <TextInput
            style={styles.input}
            placeholder="Bílias"
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
            value={magazineNumber}
            onChangeText={(text) => {
              const onlyNumbers = text.replace(/[^0-9]/g, '');
              setMagazineNumber(onlyNumbers);
            }}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Visitantes"
            value={guestNumber}
            onChangeText={(text) => {
              const onlyNumbers = text.replace(/[^0-9]/g, '');
              setGuestNumber(onlyNumbers);
            }}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Ofertas"
            value={offersNumber}
            onChangeText={(text) => {
              const onlyNumbers = text.replace(/[^0-9]/g, '');
              const formatted = formatToCurrency(onlyNumbers)
              setOffersNumber(formatted);
            }}
            keyboardType="numeric"
          />
          <Button title="Enviar" onPress={handleNewCall} />
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
    borderWidth: 1, backgroundColor: 'white', borderColor: '#ccc', padding: 10,
    borderRadius: 5, marginBottom: 10,
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
});
