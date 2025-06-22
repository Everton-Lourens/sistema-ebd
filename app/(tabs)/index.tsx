import { NewCall } from '@/classes/newCall';
import { compareDate } from '@/helper/date';
import { formatToCurrency } from '@/helper/format';
import * as Clipboard from 'expo-clipboard';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const resumoInit = {
  studentNumber: 0,
  presenceNumber: 0,
  bibleNumber: 0,
  magazineNumber: 0,
  guestNumber: 0,
  offersNumber: 0,
};
export default function Resumo() {
  const [resumo, setResumo] = useState(resumoInit);
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


  const copiarResumo = () => {
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


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo Geral - {new Date().toLocaleDateString('pt-BR')}</Text>
      <TouchableOpacity style={styles.button} onPress={getTotalGeral}>
        <Text style={styles.buttonText}>Atualizar</Text>
      </TouchableOpacity>

      <View style={styles.item}>
        <Text style={styles.label}>Total de Alunos:</Text>
        <Text style={styles.value}>{resumo.studentNumber}</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Presentes:</Text>
        <Text style={styles.value}>{resumo.presenceNumber}</Text>
      </View>

            <View style={styles.item}>
        <Text style={styles.label}>Ausentes:</Text>
        <Text style={styles.value}>{resumo.studentNumber - resumo.presenceNumber}</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Bíblias:</Text>
        <Text style={styles.value}>{resumo.bibleNumber}</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Revistas:</Text>
        <Text style={styles.value}>{resumo.magazineNumber}</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Visitantes:</Text>
        <Text style={styles.value}>{resumo.guestNumber}</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Ofertas:</Text>
        <Text style={styles.value}>{formatToCurrency(resumo.offersNumber)}</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Porcentagem Geral:</Text>
        <Text style={styles.value}>{parseFloat(((resumo.presenceNumber / resumo.studentNumber) * 100).toFixed(2)) || 0}%</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={copiarResumo}>
        <Text style={styles.buttonText}>Copiar Resumo Geral</Text>
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 20,
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
    borderRadius: 5,
    backgroundColor: '#C0C0C0',
    borderColor: 'gray',
    alignSelf: 'center'
  },
  present: { backgroundColor: '#c8facc', borderColor: '#38a169' },
  absent: { backgroundColor: '#fcdada', borderColor: '#e53e3e' },
  buttonText: { fontSize: 14 },
});
