import React from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useUserStore } from '../../constants/User/useUserStore';

export default function PerfilScreen({ navigation }: any) {
  const { name, setName } = useUserStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <TextInput
        placeholder="Digite seu nome"
        placeholderTextColor={'red'}
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <Button title="Ir para Dashboard" onPress={() => navigation.navigate('Dashboard')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold', color: 'red' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20 },
});
