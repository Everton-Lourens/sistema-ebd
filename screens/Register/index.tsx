
import { Loading } from "@/components/_ui/Loading"
import { styles } from "@/constants/styles"
import { useUserStore } from "@/stores/User/useUserStore"
import { TouchedFields } from "@/types/form"
import { useFocusEffect } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import { Formik } from "formik"
import { useCallback } from "react"
import {
  Alert,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import FormField from "../../components/FormField/FormField"
import { useFormAuth } from "./hooks/useFormAuth"
import { IStudentData, registerSchema } from "./interfaces/IStudentData"

export default function StudentFormScreen() {
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
          {/* https://formik.org/docs/overview */}
          <Formik
            initialValues={{
              name: isEditing ? name : "",
              studentClass: isEditing ? studentClass : "",
            }}
            onSubmit={onSubmitHandler}
            validationSchema={registerSchema}
          >
            {({
              handleChange,
              handleBlur,
              values,
              errors,
              isSubmitting,
              handleSubmit,
              touched,
              isValid,
            }) => (
              <>
              <View style={styles.containerTxtInput}>
                <FormField
                  field="name"
                  label="Nome"
                  autoCapitalize="words"
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <FormField
                  field="studentClass"
                  label="Classe"
                  autoCapitalize="words"
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
                </View>
              <View style={styles.btnDiv}>
                <TouchableOpacity
                  // @ts-ignore
                  onPress={handleSubmit}
                >
                  <View
                    style={[
                      styles.button,
                      {
                        opacity: isFormValid(isValid, touched) ? 1 : 0.5,
                      },
                    ]}
                  >
                    <Text style={styles.buttonText}>{isSubmitting ? <Loading size={24} /> : 'ENVIAR'}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              </>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
}
