import { Image } from 'expo-image'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Card = () => {
    return (
        <View>
            <View style={styles.imageContainer}>
                <Image source={require('../../assets/images/react-logo.png')} style={styles.image} />
            </View>
            <View >
                <View style={styles.piceContainer}> <Text style={styles.priceText}> Rs. 1000</Text> <Text style={styles.discountedPriceText}> Rs.1200</Text></View>
                <Text style={styles.productNameText}>Cap for man </Text>
            </View>
        </View>
    )
}

export default Card

const styles = StyleSheet.create({
    imageContainer: {
        width: 120,
        height: 120,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#ddeefaff',
    },
    image: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },
    priceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    piceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    discountedPriceText: {
        fontSize: 14,
        color: '#999',
        textDecorationLine: 'line-through',
        marginLeft: 8,
    },
    productNameText: {
        fontSize: 14,
        color: '#666',
    },
})