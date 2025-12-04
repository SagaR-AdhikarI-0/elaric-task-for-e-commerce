import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

interface ButtonProps {
    text: string
    onPress: () => void
    backgroundColor?: string
    textColor?: string
    borderColor?: string
    disabled?: boolean
}

const Button = ({
    text,
    onPress,
    backgroundColor,
    textColor = '#333',
    borderColor = '#4F46E5',
    disabled = false
}: ButtonProps) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: backgroundColor || 'transparent',
                    borderColor: borderColor,
                    opacity: disabled ? 0.5 : 1
                }
            ]}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={disabled}
        >
            <Text style={[styles.buttonText, { color: textColor }]}>
                {text}
            </Text>
        </TouchableOpacity>
    )
}

export default Button

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
})
