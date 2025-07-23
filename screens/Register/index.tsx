
import FormSelectField from "@/components/_ui/FormSelectField/FormSelectField"
import { HeaderPage } from "@/components/_ui/HeaderPage"
import { Loading } from "@/components/_ui/Loading"
import { styles } from "@/constants/styles"
import { useClassStore } from "@/stores/class/useClassStore"
import { useUserStore } from "@/stores/user/useUserStore"
import { TouchedFields } from "@/types/form"
import { useFocusEffect } from "@react-navigation/native"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Formik } from "formik"
import { useCallback } from "react"
import {
  Alert,
  Keyboard,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import FormField from "../../components/_ui/FormField/FormField"
import { useClasses } from "../Classes/hooks/useClasses"
import { useFormAuth } from "./hooks/useFormAuth"
import { IStudentData, registerSchema } from "./interfaces/IStudentData"

export default function StudentFormScreen() {
  const { getClasses } = useClasses()
  const { onRegister } = useFormAuth()
  const { allClassName, setAllClassName } = useClassStore()
  const {
    id,
    setId,
    name,
    setName,
    classId,
    setClassId,
    isEditing,
    setIsEditing,
  } = useUserStore();

  function getAllClasses() {
    return getClasses().then((classes) => {
      setAllClassName(classes)
    })
  }

  function onSubmitHandler(values: IStudentData) {
    console.log(JSON.stringify(values, null, 2));
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
        "\nClasse: " + values.classId,
      );
      Keyboard.dismiss();
      handleCancel();
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

  const handleCancel = () => {
    setId('');
    setName('');
    setClassId('');
    setIsEditing(false);
  }

  const focusEffectCallback = useCallback(() => {
    getAllClasses();
    if (isEditing) {
      if (!name || !classId || !id)
        throw new Error('Edição de usuário inválida');
      console.log('Editando user: ' + name);
    }
    return () => {
      handleCancel();
    };
  }, []);

  useFocusEffect(focusEffectCallback);

  return (
    <>
      <SafeAreaView style={styles.topSafeArea} />

      <StatusBar style="light" />

      <SafeAreaView style={styles.container}>
        <HeaderPage
          HeaderText="Cadastro"
          onClickFunction={() => router.back()}
          disabled={false}
        />

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
              classId: isEditing ? classId : "",
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
              resetForm,
            }) => (
              <>
                <View style={styles.containerTxtInput}>
                  <FormField
                    field="name"
                    label="Nome"
                    autoCapitalize="words"
                    placeholder="Digite seu nome"
                    values={values}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                  />

                  <FormSelectField
                    field="classId"
                    label="Classe"
                    values={values}
                    touched={touched}
                    placeholder="Selecione uma classe..."
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    options={allClassName.map((classes: any) => ({
                      value: classes.id,
                      label: classes.name
                    }))}
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
                          opacity: 1,
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
