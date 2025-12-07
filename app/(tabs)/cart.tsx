import Button from '@/components/Button'
import CartCard from '@/components/cartCard'
import { useCart } from '@/Context/cartContext'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const cart = () => {
    const { cart, updateQuantity, removeFromCart } = useCart()
    console.log("Cart items", cart);

    return (
        <SafeAreaView style={styles.container}>

            {cart.length > 0 ? (
                <>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                        <Ionicons name="cart" size={25} color="#1F2937" style={{ marginTop: -12 }} />
                        <Text style={styles.title}> Your Cart </Text>
                    </View>
                    <FlatList
                        data={cart}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <CartCard
                                id={item.id}
                                name={item.name}
                                price={item.price}
                                imageUrl={item.imageUrl}
                                quantity={item.quantity}
                                category={item.category}
                                onIncrement={(id) => updateQuantity(id, item.quantity + 1)}
                                onDecrement={(id) => updateQuantity(id, item.quantity - 1)}
                                onRemove={(id) => removeFromCart(id)}
                            />
                        )}
                    />
                    <Button text='Checkout' backgroundColor='#4F46E5' textColor='#FFF' onPress={() => {}} />
                </>
            ) : (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="cart-outline" size={100} color="#617ba3ff" />
                    </View>
                    <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
                    <Text style={styles.emptySubtitle}>
                        Please add some products to your cart to see them here.
                    </Text>
                </View>
            )}
        </SafeAreaView>
    )
}

export default cart

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F9FAFB',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    shopButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4F46E5',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    shopButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
    },
})