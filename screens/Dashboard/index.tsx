
import { Column } from "@/components/_ui/ChatTableComponent/interfaces"
import { HeaderPage } from "@/components/_ui/HeaderPage"
import { ListMobile } from "@/components/_ui/ListMobile"
import { useDashboardStore } from "@/constants/dashboard"
import { copyResumeToClipboard } from "@/constants/dashboard/clipboard"
import { styles } from "@/constants/styles"
import { useFocusEffect } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useCallback, useState } from "react"
import {
  SafeAreaView,
  View
} from "react-native"
import { useDashboard } from "./hooks/useDashboard"

const fakeColumns: Column[] = [
  {
    headerName: 'Classe',
    field: 'className',
    flex: 2,
  },
  {
    headerName: 'Percentual',
    field: 'percent',
    flex: 2,
  },
];

const fakeRows = [
  { className: 'Senhores', percent: '50%' },
  { className: 'Jovens', percent: '70%' },
  { className: 'Adolescentes', percent: '20%' },
];

export default function Dashboard() {
  const { loadingDashboard } = useDashboard()
  const { arrayDashboardData, setDashboardData, clearDashboardData } = useDashboardStore();
  const [loading, setLoading] = useState(false);

  const focusEffectCallback = useCallback(() => {
    onRefresh();
    return () => {
      clearDashboardData();
    };
  }, []);

  useFocusEffect(focusEffectCallback);

  const onRefresh = () => {
    setLoading(true);
    clearDashboardData();
    loadingDashboard().then((data: any) => {
      setDashboardData(data)
      setLoading(false);
    });
  }

  return (
    <>
      <SafeAreaView style={styles.topSafeArea} />

      <StatusBar style="light" />

      <SafeAreaView style={styles.container}>
        <HeaderPage
          HeaderText="Dashboard"
          onClickFunction={() => {}}
          disabled={true}
        />
        <View style={{ flex: 1 }}>
          <ListMobile
            loading={loading}
            emptyText="Nenhum registro disponível!"
            items={arrayDashboardData}
            onSubmit={copyResumeToClipboard}
            textButton="Copiar"
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
      </SafeAreaView>
    </>
  );
}