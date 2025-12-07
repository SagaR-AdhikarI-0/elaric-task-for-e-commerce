import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CartCardProps = {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
    category?: string;
    onIncrement: (id: string) => void;
    onDecrement: (id: string) => void;
    onRemove: (id: string) => void;
};

const CartCard = ({
    id,
    name,
    price,
    imageUrl,
    quantity,
    category,
    onIncrement,
    onDecrement,
    onRemove,
}: CartCardProps) => {
    return (
        <View style={styles.container}>
            {/* Product Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.productImage}
                    contentFit="cover"
                />
            </View>

            {/* Product Details */}
            <View style={styles.detailsContainer}>
                <Text style={styles.productName} numberOfLines={2}>
                    {name}
                </Text>
                {category && (
                    <Text style={styles.category}>{category}</Text>
                )}
                <View style={styles.priceRow}>
                    <Text style={styles.price}>रु {price}</Text>
                    <Text style={styles.subtotal}>
                        Total: रु {price * quantity}
                    </Text>
                </View>
            </View>

            {/* Quantity Controls */}
            <View style={styles.quantityContainer}>
                <View style={styles.quantityControls}>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => onDecrement(id)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="remove" size={16} color="#4F46E5" />
                    </TouchableOpacity>

                    <View style={styles.quantityBadge}>
                        <Text style={styles.quantityText}>{quantity}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => onIncrement(id)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="add" size={16} color="#4F46E5" />
                    </TouchableOpacity>
                </View>

                {/* Delete Button */}
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onRemove(id)}
                    activeOpacity={0.7}
                >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CartCard;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,

    },
    imageContainer: {
        width: 90,
        height: 90,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#F9FAFB',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    detailsContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    productName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        lineHeight: 20,
        marginBottom: 4,
    },
    category: {
        fontSize: 11,
        color: '#6B7280',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontWeight: '500',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4F46E5',
    },
    subtotal: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    quantityContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 8,
        paddingVertical: 4,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 20,
        padding: 4,
        gap: 8,
    },
    quantityButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#4F46E5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityBadge: {
        minWidth: 32,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#EEF2FF',
        borderRadius: 8,
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4F46E5',
    },
    deleteButton: {
        marginTop: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
    },
});