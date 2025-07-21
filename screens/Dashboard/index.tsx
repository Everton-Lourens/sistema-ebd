
import { ListMobile } from "@/components/_ui/ListMobile"
import { Loading } from "@/components/_ui/Loading"
import { useDashboardStore } from "@/constants/dashboard"
import { styles } from "@/constants/styles"
import { useFocusEffect } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useCallback } from "react"
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { useDashboard } from "./hooks/useDashboard"

export default function Dashboard() {
  const { loadingDashboard } = useDashboard()
  const { arrayDashboardData, setDashboardData, clearDashboardData } = useDashboardStore();

  const focusEffectCallback = useCallback(() => {
    onRefresh();
    return () => {
      clearDashboardData();
    };
  }, []);

  useFocusEffect(focusEffectCallback);

  const onRefresh = () => {
    loadingDashboard().then((data: any) => setDashboardData(data));
  }

  const loadinDiv = () => {
    return (
        <Loading size={100} color="gray" />
    )
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

          {arrayDashboardData.length == 0 ? loadinDiv() :
          <View style={{ flex: 1 }}>
            <ListMobile
              loading={false}
              emptyText="Nenhum registro disponível!"
              items={arrayDashboardData}
              itemFields={[
                { field: 'className', valueFormatter: undefined },
                { field: 'enrolled', valueFormatter: undefined },
              ]}
              collapseItems={[
                { field: 'attendancePercentage', headerName: 'Percentual', type: 'text' },
                { field: 'total', headerName: 'Total', type: 'text' },
              ]}
            />
          </View>}

        </KeyboardAwareScrollView>
        <TouchableOpacity
          style={styles.button}
          onPress={onRefresh}
        >
          <Text style={styles.buttonText}>Atualizar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}
