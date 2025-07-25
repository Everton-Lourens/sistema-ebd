
import { HeaderPage } from "@/components/_ui/HeaderPage"
import { ListMobile } from "@/components/_ui/ListMobile"
import { useAttendanceStore } from "@/constants/attendance"
import { styles } from "@/constants/styles"
import { copyResumeToClipboard } from "@/helpers/clipboard"
import { useFocusEffect } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useCallback, useState } from "react"
import {
  SafeAreaView,
  View
} from "react-native"
import { useAttendance } from "./hooks/useAttendance"

export default function Attendance() {
  const { loadingAttendance } = useAttendance()
  const { arrayAttendanceData, setAttendanceData, clearAttendanceData } = useAttendanceStore();
  const [loading, setLoading] = useState(false);

  const focusEffectCallback = useCallback(() => {
    onRefresh();
    return () => {
      clearAttendanceData();
    };
  }, []);

  useFocusEffect(focusEffectCallback);

  const onRefresh = () => {
    setLoading(true);
    clearAttendanceData();
    loadingAttendance().then((data: any) => {
      setAttendanceData(data)
      setLoading(false);
    });
  }

  return (
    <>
      <SafeAreaView style={styles.topSafeArea} />

      <StatusBar style="light" />

      <SafeAreaView style={styles.container}>
        <HeaderPage
          HeaderText="Controle de Presença"
          onClickFunctionLeft={() => { }}
          buttonLeftDisabled={true}
          buttonRightDisabled={true}
          showDate={true}
        />
        <View style={{ flex: 1 }}>
          <ListMobile
            loading={loading}
            emptyText="Nenhum registro disponível!"
            items={arrayAttendanceData}
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