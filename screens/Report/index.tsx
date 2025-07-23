
import { Column } from "@/components/_ui/ChatTableComponent/interfaces"
import { HeaderPage } from "@/components/_ui/HeaderPage"
import { TableComponent } from "@/components/_ui/TableComponent"
import { useClassesStore } from "@/constants/classes"
import { styles } from "@/constants/styles"
import { router, useFocusEffect } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useCallback, useState } from "react"
import {
  SafeAreaView,
  View
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { useDashboard } from "./hooks/useDashboard"

const fakeColumnsPresent: Column[] = [
  {
    headerName: 'Presença',
    field: 'className',
    flex: 2,
  },
  {
    headerName: '%',
    field: 'percent',
    flex: 2,
  },
];

const fakeRowsPresent = [
  { id: '1', className: 'Senhores', percent: '50%' },
  { id: '2', className: 'Jovens', percent: '70%' },
  { id: '3', className: 'Adolescentes', percent: '20%' },
];

const fakeColumnsOffer: Column[] = [
  {
    headerName: 'Oferta',
    field: 'className',
    flex: 2,
  },
  {
    headerName: 'R$',
    field: 'offer',
    flex: 2,
  },
];

const fakeRowsOffer = [
  { id: '1', className: 'Adolescentes', offer: 'R$ 5,00' },
  { id: '2', className: 'Senhoras', offer: 'R$ 2,50' },
  { id: '3', className: 'Senhores', offer: 'R$ 0,00' },
];

export default function Report() {
  const { loadingDashboard } = useDashboard()
  const { arrayDashboardData, setDashboardData, clearDashboardData } = useClassesStore();
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
          HeaderText="Relatório Geral"
          onClickFunction={() => router.back()}
          disabled={true}
        />
        {/* https://github.com/APSL/react-native-keyboard-aware-scroll-view */}
        <KeyboardAwareScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={150}
        >

          {/*<TableComponent
            columns={fakeColumnsPresent}
            rows={fakeRowsPresent}
            loading={loading}
            emptyText="Sem registros disponíveis"
            heightSkeleton={40}
          />*/}

          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <TableComponent
              columns={fakeColumnsPresent}
              rows={fakeRowsPresent}
              loading={loading}
              emptyText="Sem registros disponíveis"
              heightSkeleton={40}
            />

            <TableComponent
              columns={fakeColumnsOffer}
              rows={fakeRowsOffer}
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