import { Image } from 'expo-image'
import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'

const { width: screenWidth } = Dimensions.get('window')
const cardWidth = (screenWidth - 60) / 3  // Assuming 20px margin on each side and 20px gap between cards
type Props = {
    name: string
    image: string
    price: number
    brand?: string
}
const Card = ({
    name = "EKYBOARD Mechanical Gaming Keyboard, RGB Backlit, USB Wired, Anti-Ghosting, 104 Keys, Black ",
    image = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800",
    price = 1000,
    brand = "Nike",
}: Props) => {
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={{ uri: image }} contentFit='cover' />
            <View style={styles.textCintainer}>
                <Text style={styles.price}> रु {price}</Text>
                <Text style={styles.brand} numberOfLines={1} ellipsizeMode="tail">{brand} . Regular </Text>
                <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">{name}</Text>

            </View>
        </View>
    )
}

export default Card

const styles = StyleSheet.create({
    container: {
        width: cardWidth,
    },
    image: {
        borderRadius: 12,
        width: cardWidth,
        height: cardWidth,
        backgroundColor: '#f0f0f0',
        borderWidth: 0.5,
        borderColor: '#ddd',
    },
    textCintainer: {
        marginTop: 8,
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
    },
    brand: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: '400',
        width: cardWidth,
    }
})