
import { ListMobile } from "@/components/_ui/ListMobile"
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
    clearDashboardData();
    loadingDashboard().then((data: any) => setDashboardData(data));
  }

  return (
    <>
      <SafeAreaView style={styles.topSafeArea} />

      <StatusBar style="light" />

      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Dashboard</Text>
        </View>

          <View style={{ flex: 1 }}>
            <ListMobile
              loading={arrayDashboardData.length === 0}
              emptyText="Nenhum registro disponível!"
              items={arrayDashboardData}
              itemFields={[
                { field: 'className', valueFormatter: undefined }, 
                { field: 'enrolled', valueFormatter: undefined },
              ]}
              collapseItems={[
                { field: 'enrolled', headerName: 'Matriculados', type: 'text' },
                { field: 'absent', headerName: 'Ausentes', type: 'text' },
                { field: 'present', headerName: 'Presentes', type: 'text' },
                { field: 'visitors', headerName: 'Visitantes', type: 'text' },
                { field: 'total', headerName: 'Total', type: 'text' },
                { field: 'bible', headerName: 'Bíblia', type: 'text' },
                { field: 'magazine', headerName: 'Revista', type: 'text' },
                { field: 'offer', headerName: 'Oferta', type: 'text' },
                { field: 'attendancePercentage', headerName: 'Percentual de Presença', type: 'text' },
                { field: 'biblePercentage', headerName: 'Percentual de Bíblia', type: 'text' },
                { field: 'magazinePercentage', headerName: 'Percentual de Revista', type: 'text' },
              ]}
            />
          </View>

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
