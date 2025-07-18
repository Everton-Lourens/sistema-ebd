
import { Loading } from "@/components/_ui/Loading"
import { styles } from "@/constants/styles"
import { TouchedFields } from "@/types/form"
import { StatusBar } from "expo-status-bar"
import { Formik } from "formik"
import React from "react"
import {
  Alert,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import FormField from "../../FormField/FormField"
import { useFormAuth } from "./hooks/useFormAuth"
import { IRegisterData, registerSchema } from "./interfaces/IRegisterData"

export default function RegisterForm() {
  const { onRegister } = useFormAuth()

  function onSubmitHandler(values: IRegisterData) {
    // https://reactnative.dev/docs/alert
    return onRegister(values).then(() => {
      Alert.alert(
        "Aluno Registrado!",
        "Dados: " + JSON.stringify(values)
      );
      return true
    }).catch(() => {
      Alert.alert(
        "Falha ao registrar aluno!",
        "Form data: " + JSON.stringify(values)
      );
      return false
    })
  }

  function isFormValid(isValid: boolean, touched: TouchedFields): boolean {
    return isValid && Object.keys(touched).length !== 0;
  }

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
              name: "",
              studentClass: "",
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
              </>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
}

