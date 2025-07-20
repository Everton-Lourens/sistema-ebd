
import { ListMobile } from "@/components/_ui/ListMobile"
import { styles } from "@/constants/styles"
import { useUserStore } from "@/stores/User/useUserStore"
import { TouchedFields } from "@/types/form"
import { useFocusEffect } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import { useCallback } from "react"
import {
  Alert,
  SafeAreaView,
  Text,
  View
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { useFormAuth } from "./hooks/useFormAuth"
import { IStudentData } from "./interfaces/IStudentData"

export default function Dashboard() {
  const {
    id,
    setId,
    name,
    setName,
    studentClass,
    setStudentClass,
    isEditing,
    setIsEditing,
  } = useUserStore();
  const { onRegister } = useFormAuth()

  function onSubmitHandler(values: IStudentData) {
    /*
    if (isEditing && id) {
      updateStudent(id, values); // lógica para editar
    } else {
      createStudent(values); // lógica para novo cadastro
    }
    router.push('/'); // redireciona após salvar
*/
    // https://reactnative.dev/docs/alert
    return onRegister(values).then(() => {
      Alert.alert(
        "Aluno Registrado!",
        "Nome: " + values.name +
        "\nClasse: " + values.studentClass,
      );
    }).catch(() => {
      Alert.alert(
        "Falha ao registrar aluno!",
        "Form data: " + JSON.stringify(values)
      );
    })
  }

  function isFormValid(isValid: boolean, touched: TouchedFields): boolean {
    return isValid && Object.keys(touched).length !== 0;
  }

  const focusEffectCallback = useCallback(() => {
    if (isEditing) {
      if (!name || !studentClass || !id)
        throw new Error('Edição de usuário inválida');
      console.log('Editando user: ' + name);
    }
    return () => {
      setId('');
      setName('');
      setStudentClass('');
      setIsEditing(false);
    };
  }, []);

  useFocusEffect(focusEffectCallback);

  return (
    <>
      <SafeAreaView style={styles.topSafeArea} />

      <StatusBar style="light" />

      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Register</Text>
        </View>

        {/* https://github.com/APSL/react-native-keyboard-aware-scroll-view */}
        <KeyboardAwareScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={150}
        >
          <View style={{ flex: 1 }}>
            <ListMobile
              loading={false}
              emptyText="Nenhum registro disponível!"
              items={[
                {
                  _id: 1,
                  nome: 'Carlos',
                  email: 'carlos@email.com',
                  idade: 28,
                  cidade: 'Salvador',
                },
                {
                  _id: 2,
                  nome: 'Ana',
                  email: 'ana@email.com',
                  idade: 24,
                  cidade: 'Camaçari',
                },
              ]}
              itemFields={[
                { field: 'nome', valueFormatter: undefined },
                { field: 'email', valueFormatter: undefined },
              ]}
              collapseItems={[
                { field: 'idade', headerName: 'Idade', type: 'text' },
                { field: 'cidade', headerName: 'Cidade', type: 'text' },
              ]}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
}
