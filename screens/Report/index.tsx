
import { HeaderPage } from "@/components/_ui/HeaderPage"
import { ListMobile } from "@/components/_ui/ListMobile"
import { TableComponent } from "@/components/_ui/TableComponent"
import { columnsOffer, columnsPresent, useReportStore } from "@/constants/report"
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
  const { loadingGeneralReport, loadingRankingPresent, loadingRankingOffer } = useReport()
  const { arrayReportGeneralData, setReportGeneralData, clearReportGeneralData } = useReportStore();
  const { arrayPresentRankingData, setPresentRankingData, clearPresentRankingData } = useReportStore();
  const { arrayOfferRankingData, setOfferRankingData, clearOfferRankingData } = useReportStore();

  const [loadingGeneral, setLoadingGeneral] = useState(false);
  const [loadingPresent, setLoadingPresent] = useState(false);
  const [loadingOffer, setLoadingOffer] = useState(false);

  const getLoadingGeneralReport = () => {
    setLoadingGeneral(true);
    clearReportGeneralData();
    loadingGeneralReport().then((data: any) => {
      setReportGeneralData(data)
      setLoadingGeneral(false);
    });
  }

  const getLoadingPresentRanking = () => {
    setLoadingPresent(true);
    clearPresentRankingData();
    loadingRankingPresent().then((data: any) => {
      setPresentRankingData(data)
      setLoadingPresent(false);
    });
  }

  const getLoadingOfferRanking = () => {
    setLoadingOffer(true);
    clearOfferRankingData();
    loadingRankingOffer().then((data: any) => {
      setOfferRankingData(data)
      setLoadingOffer(false);
    });
  }

  const focusEffectCallback = useCallback(() => {
    onRefresh();
    return () => {
      clearReportGeneralData();
      clearPresentRankingData();
      clearOfferRankingData();
    };
  }, []);

  useFocusEffect(focusEffectCallback);

  const onRefresh = () => {
    getLoadingGeneralReport();
    getLoadingPresentRanking();
    getLoadingOfferRanking();
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
          loading={loadingGeneral}
          emptyText="Nenhum registro disponível!"
          items={arrayReportGeneralData}
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
              columns={columnsPresent}
              rows={arrayPresentRankingData}
              loading={loadingPresent}
              emptyText="Sem registros disponíveis"
              heightSkeleton={40}
            />

            <TableComponent
              columns={columnsOffer}
              rows={arrayOfferRankingData}
              loading={loadingOffer}
              emptyText="Sem registros disponíveis"
              heightSkeleton={40}
            />

          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView >
    </>
  );
}