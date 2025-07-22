import { styles } from "@/constants/styles"
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { IconSymbol } from "../IconSymbol"

type Props = {
  HeaderText: string
  onClickFunction: () => void
  disabled?: boolean
}

export function HeaderPage({
  HeaderText = 'ERRO',
  onClickFunction,
  disabled = false,
}: Props) {
  return (
    <>
      <View style={styles.header}>
        <StatusBar style="light" />

        <TouchableOpacity
          style={styles.backButton}
          onPress={onClickFunction}
          disabled={disabled}
        >
            {disabled ? null : <IconSymbol style={styles.icon} size={40} name="house.fill" color="white" />}
        </TouchableOpacity>

        <Text style={styles.headerText}>
          {HeaderText}
        </Text>
      </View>
    </>
  )
}

