
import { HeaderPage } from "@/components/_ui/HeaderPage"
import { ListMobile } from "@/components/_ui/ListMobile"
import { TableComponent } from "@/components/_ui/TableComponent"
import { columnsOffer, useReportStore } from "@/constants/report"
import { styles } from "@/constants/styles"
import { copyResumeToClipboard } from "@/helpers/clipboard"
import { router, useFocusEffect } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useCallback, useState } from "react"
import {
  SafeAreaView,
  View
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { useReport } from "./hooks/useReport"

export default function Report() {
  const { loadingGeneralReport, getRankingClasses } = useReport()
  const { arrayReportData, setReportData, clearReportData } = useReportStore();
  const [loading, setLoading] = useState(false);

  const focusEffectCallback = useCallback(() => {
    onRefresh();
    return () => {
      clearReportData();
    };
  }, []);

  useFocusEffect(focusEffectCallback);

  const onRefresh = () => {
    setLoading(true);
    clearReportData();
    loadingGeneralReport().then((data: any) => {
      setReportData(data)
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
          showDate={true}
        />

        <ListMobile
          loading={loading}
          emptyText="Nenhum registro disponível!"
          items={arrayReportData}
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
        {/* https://github.com/APSL/react-native-keyboard-aware-scroll-view */}
        <KeyboardAwareScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={150}
        >
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <TableComponent
              columns={columnsOffer}
              rows={arrayReportData}
              loading={loading}
              emptyText="Sem registros disponíveis"
              heightSkeleton={40}
            />

          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView >
    </>
  );
}