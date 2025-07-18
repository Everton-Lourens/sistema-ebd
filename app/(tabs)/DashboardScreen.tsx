import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useUserStore } from '../../constants/User/useUserStore';

export default function DashboardScreen({ navigation }: any) {
  const { name } = useUserStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.info}>Nome salvo: {name}</Text>
      <Button title="Voltar para Perfil" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold', color: 'red' },
  info: { fontSize: 18, marginBottom: 20 },
});
