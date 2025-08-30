
import { HeaderPage } from "@/components/_ui/HeaderPage"
import { useAttendanceStore } from "@/constants/attendance"
import { styles } from "@/constants/styles"
import { copyResumeToClipboard } from "@/helpers/clipboard"
import { Switch } from "@/screens/Attendance/Switch"
import { router, useFocusEffect, useLocalSearchParams } from "expo-router"

import { FloatingButton } from "@/components/_ui/FloatingButton"
import { IconSymbol } from "@/components/_ui/IconSymbol"
import { formatToCurrency } from "@/helpers/format"
import { StatusBar } from "expo-status-bar"
import { useCallback, useState } from "react"
import {
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"
import { useAttendance } from "./hooks/useAttendance"

export default function Attendance() {
  const { loadingAttendance, insertDetailsClasses } = useAttendance()
  const { arrayAttendanceData, setAttendanceData, clearAttendanceData } = useAttendanceStore();
  const [loading, setLoading] = useState(false);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [visitors, setVisitors] = useState<string>('0');
  const [offering, setOffering] = useState<string>('R$ 0,00');
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

  const sendVisitorsAndOffering = () => {
    if (Number(visitors.replace(/[^0-9]/g, '')) > 0 && Number(offering.replace(/[^0-9]/g, '')) > 0) {
      insertDetailsClasses({
        visitors: Number(visitors.replace(/[^0-9]/g, '')),
        offer: Number(offering.replace(/[^0-9]/g, '')),
        classId: Number(id)
      });
    } else {
      console.log('Por favor, preencha os campos de Visitantes e Oferta.');
    }
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

        <FloatingButton
          onClickFunction={() => { setPopUpVisible(true) }}
          iconFloatingButton={<IconSymbol size={30} name="dollarsign.square.fill" color="white" />}
        />

        <View>
          <Modal
            visible={popUpVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setPopUpVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={{ width: '100%', alignContent: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: 20, marginTop: 40, height: '30%' }}>
                  <TextInput
                    style={[styles.modalContent, { marginBottom: 15 }]}
                    placeholder="Visitantes"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={visitors}
                    onChangeText={(text) => setVisitors(text)}
                  />
                  <TextInput
                    style={[styles.modalContent, { marginBottom: 10 }]}
                    placeholder="Oferta"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={offering}
                    onChangeText={(text) => setOffering(formatToCurrency(text))}
                  />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, marginTop: 20 }}>

                  <TouchableOpacity onPress={() => {
                    setPopUpVisible(false)
                    setVisitors('0');
                    setOffering('R$ 0,00');
                  }} style={styles.closeButton}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {
                    setPopUpVisible(false)
                    sendVisitorsAndOffering();
                    setVisitors('0');
                    setOffering('R$ 0,00');
                  }} style={styles.sendButton}>
                    <Text style={styles.buttonText}>Enviar</Text>
                  </TouchableOpacity>

                </View>
              </View>
            </View>
          </Modal>
        </View>

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
