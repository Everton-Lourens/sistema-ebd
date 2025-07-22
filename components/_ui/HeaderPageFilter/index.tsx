import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { IconSymbol } from '../IconSymbol'

type Props = {
  buttonText: string
  onClickFunction: () => void
  InputFilter?: React.ReactNode
  disabled?: boolean
}

export function HeaderPage({
  buttonText,
  onClickFunction,
  InputFilter = <></>,
  disabled = false,
}: Props) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.filters}>{InputFilter && InputFilter}</View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.createNewButton}
          onPress={onClickFunction}
          disabled={disabled}
        >
          <IconSymbol size={28} name="chevron.left" color="black" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filters: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  createNewButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },
})


