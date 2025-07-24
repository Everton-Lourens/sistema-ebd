import { styles } from "@/constants/styles"
import React, { JSX } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { IconSymbol } from "../IconSymbol"

type Props = {
    textButton?: string
    onClickFunction: () => void
    style?: object
    iconFloatingButton?: JSX.Element
}

export function FloatingButton({
    textButton = '',
    onClickFunction,
    style = {},
    iconFloatingButton = <IconSymbol size={30} name="plus" color="white" />,
}: Props) {
    return (
            <TouchableOpacity
                style={[styles.buttonAdd, style]}
                onPress={onClickFunction}
            >
                {textButton ? <Text>{textButton}</Text> : iconFloatingButton}
            </TouchableOpacity>
    );
}
