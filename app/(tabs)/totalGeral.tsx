import React, { useState } from 'react';
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

  const selectedClass = classes.find(c => c.id === selectedClassId);

  const handleAddStudent = () => {
    if (!newStudentName.trim()) return;
    const updated = classes.map(c => {
      if (c.id === selectedClassId) {
        return {
          ...c,
          students: [
            ...c.students,
            { name: newStudentName.trim(), presence: null },
            { name: 'Everton', presence: true },
          ],
        };
      }
      return c;
    });
    setClasses(updated);
    setNewStudentName('');
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle de Presença</Text>

      {!selectedClassId ? (
        <>
          <Text style={styles.subtitle}>Selecione uma Classe:</Text>
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
                  {item.students.length} aluno(s)
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
            placeholder="Nome do aluno"
            value={newStudentName}
            onChangeText={setNewStudentName}
          />
          <Button title="Adicionar aluno" onPress={handleAddStudent} />

          <FlatList
            data={selectedClass.students}
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
                </View>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 10 },
  input: {
    borderWidth: 1, borderColor: '#aaa', borderRadius: 5,
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
