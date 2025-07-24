import { styles } from "@/constants/styles"
import { getToday } from "@/helpers/format"
import { StatusBar } from 'expo-status-bar'
import React, { JSX } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { IconSymbol } from "../IconSymbol"

type Props = {
  HeaderText: string
  onClickFunctionLeft?: () => void
  onClickFunctionRight?: () => void
  buttonLeftDisabled?: boolean
  buttonRightDisabled?: boolean
  iconLeftComponent?: JSX.Element
  iconRightComponent?: JSX.Element
  showDate?: boolean
}

export function HeaderPage({
  HeaderText = 'ERRO',
  onClickFunctionLeft,
  onClickFunctionRight,
  buttonLeftDisabled = false,
  buttonRightDisabled = false,
  iconLeftComponent = <IconSymbol style={styles.icon} size={40} name="chevron.left" color="white" />,
  iconRightComponent = <IconSymbol style={styles.icon} size={40} name="house.fill" color="white" />,
  showDate = false
}: Props) {
  return (
    <>
      <View style={styles.header}>
        <StatusBar style="light" />

        <TouchableOpacity
          style={styles.leftButton}
          onPress={onClickFunctionLeft}
          disabled={buttonLeftDisabled}
        >
          {buttonLeftDisabled ? null : iconLeftComponent}
        </TouchableOpacity>

        <Text style={[styles.headerText, showDate && { marginTop: 10 }]}>
          {HeaderText}
        </Text>
        {showDate && <Text style={[styles.headerText, { marginTop: 60, fontSize: 15 }]}>
          {getToday()}
        </Text>}

        <TouchableOpacity
          style={styles.rightButton}
          onPress={onClickFunctionRight}
          disabled={buttonRightDisabled}
        >
          {buttonRightDisabled ? null : iconRightComponent}
        </TouchableOpacity>
      </View>
    </>
  )
}

