
import { ListMobile } from "@/components/_ui/ListMobile"
import { styles } from "@/constants/styles"
import { StatusBar } from "expo-status-bar"
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { useDashboard } from "./hooks/useDashboard"

export default function Dashboard() {
  const { getDashboardData } = useDashboard()
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
                  id: 1,
                  class: 'Cordeirinhos de Cristo',
                  email: 'carlos@email.com',
                  idade: 28,
                  church: 'Dois de Julho',
                  city: 'Camaçari',
                  countClass: 3,
                },
                {
                  id: 2,
                  class: 'Shalom',
                  email: 'ana@email.com',
                  idade: 24,
                  church: 'Dois de Julho',
                  city: 'Camaçari',
                  countClass: 2,
                },
              ]}
              itemFields={[
                { field: 'class', valueFormatter: undefined },
                { field: 'countClass', valueFormatter: undefined },
              ]}
              collapseItems={[
                { field: 'countClass', headerName: 'Matriculados', type: 'text' },
                { field: 'city', headerName: 'Cidade', type: 'text' },
              ]}
            />
          </View>
                <TouchableOpacity
        style={styles.button}
        onPress={getDashboardData}
      >
        <Text style={styles.buttonText}>Buscar dados</Text>
      </TouchableOpacity>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
}
