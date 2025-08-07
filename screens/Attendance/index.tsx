
import { HeaderPage } from "@/components/_ui/HeaderPage"
import { useAttendanceStore } from "@/constants/attendance"
import { styles } from "@/constants/styles"
import { copyResumeToClipboard } from "@/helpers/clipboard"
import { Switch } from "@/screens/Attendance/Switch"
import { router, useFocusEffect, useLocalSearchParams } from "expo-router"

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
  const [className, setClassName] = useState<string | null>(null);
  const { id } = useLocalSearchParams();

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
    loadingAttendance(Number(id)).then((data: any) => {
      setClassName(data[0]?.className || null);
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
          HeaderText={className || 'Controle de Presença'}
          onClickFunctionLeft={() => router.back()}
          onClickFunctionRight={() => { }}
          buttonLeftDisabled={false}
          buttonRightDisabled={true}
          showDate={true}
        />
        <View style={{ flex: 1 }}>
          <Switch
            loading={loading}
            emptyText="Nenhum registro disponível!"
            items={arrayAttendanceData}
            onSubmit={copyResumeToClipboard}
            textButton="Copiar"
            itemFields={[
              { field: 'name', valueFormatter: undefined },
            ]}
            collapseItems={[
              { field: 'className', headerName: 'Classe', type: 'text' },
              { field: 'fullName', headerName: 'Nome Completo', type: 'text' },
            ]}
          />
        </View>
      </SafeAreaView>
    </>
  );
}