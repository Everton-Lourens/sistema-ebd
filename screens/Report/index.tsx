
import { Column } from "@/components/_ui/ChatTableComponent/interfaces"
import { HeaderPage } from "@/components/_ui/HeaderPage"
import { TableComponent } from "@/components/_ui/TableComponent"
import { useDashboardStore } from "@/constants/dashboard"
import { styles } from "@/constants/styles"
import { router, useFocusEffect } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useCallback, useState } from "react"
import {
  SafeAreaView,
  Text,
  View
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
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

export default function Report() {
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
          HeaderText="Relatório"
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


          <View style={{ flex: 1, justifyContent: 'space-between' }}>

            <Text style={{ color: 'gray', fontSize: 20, alignSelf: 'center' }}>Vencedores em presença</Text>
            <TableComponent
              columns={fakeColumns}
              rows={fakeRows}
              loading={loading}
              emptyText="Sem registros disponíveis"
              heightSkeleton={40}
            />
            <Text style={{ color: 'gray', fontSize: 20, alignSelf: 'center' }}>Vencedores em Oferta</Text>
            <TableComponent
              columns={fakeColumns}
              rows={fakeRows}
              loading={loading}
              emptyText="Sem registros disponíveis"
              heightSkeleton={40}
            />
            <Text style={{ color: 'gray', fontSize: 20, alignSelf: 'center' }}>Relatório Geral</Text>
            <TableComponent
              columns={fakeColumns}
              rows={fakeRows}
              loading={loading}
              emptyText="Sem registros disponíveis"
              heightSkeleton={40}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
}