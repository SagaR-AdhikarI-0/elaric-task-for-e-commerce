import { useAuth } from '@/Context/authContext';
import { useCart } from '@/Context/cartContext';
import { db } from '@/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const SingleProductPage = () => {
    const { prdouctId } = useLocalSearchParams();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { user } = useAuth();

    useEffect(() => {
        console.log("Product ko id k xa:", prdouctId);
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, "products", prdouctId as string);
                console.log("Document Reference:", docRef);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log("Product not found");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [prdouctId])

    console.log("Fetched Product:", product);
    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4F46E5" />
            </SafeAreaView>
        );
    }

    if (!product) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text style={styles.errorText}>Product not found</Text>
            </SafeAreaView>
        );
    }

    const increaseQuantity = () => setQuantity(prev => prev + 1);
    const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
    const { role } = useAuth();

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <SafeAreaView style={styles.container}>
                {/* Custom Header */}
                <View style={styles.customHeader}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.headerButton}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Product Details</Text>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="heart-outline" size={24} color="#1F2937" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Product Image */}
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: product.imageUrl }}
                            style={styles.productImage}
                            contentFit="contain"
                        />
                    </View>

                    {/* Product Details */}
                    <View style={styles.detailsContainer}>
                        {/* Category Badge */}
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{product.category}</Text>
                        </View>

                        {/* Product Name */}
                        <Text style={styles.productName}>{product.name}</Text>

                        {/* Rating */}
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={18} color="#FCD34D" />
                            <Text style={styles.ratingText}>4.8</Text>
                            <Text style={styles.reviewText}>(2.3k reviews)</Text>
                        </View>

                        {/* Price */}
                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>रु {product.price}</Text>
                            <View style={styles.stockBadge}>
                                <View style={styles.stockDot} />
                                <Text style={styles.stockText}>In Stock</Text>
                            </View>
                        </View>

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Description */}
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{product.description}</Text>

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Quantity Selector */}
                        <Text style={styles.sectionTitle}>Quantity</Text>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={decreaseQuantity}
                            >
                                <Ionicons name="remove" size={20} color="#4F46E5" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={increaseQuantity}
                            >
                                <Ionicons name="add" size={20} color="#4F46E5" />
                            </TouchableOpacity>
                        </View>

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Features */}
                        <Text style={styles.sectionTitle}>Features</Text>
                        <View style={styles.featuresList}>
                            <View style={styles.featureItem}>
                                <Ionicons name="shield-checkmark" size={20} color="#10B981" />
                                <Text style={styles.featureText}>Quality Guaranteed</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Ionicons name="rocket" size={20} color="#10B981" />
                                <Text style={styles.featureText}>Fast Delivery</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Ionicons name="repeat" size={20} color="#10B981" />
                                <Text style={styles.featureText}>Easy Returns</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Ionicons name="card" size={20} color="#10B981" />
                                <Text style={styles.featureText}>Secure Payment</Text>
                            </View>
                        </View>

                        {/* Bottom Spacing */}
                        <View style={{ height: 100 }} />
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* Bottom Action Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={() => {
                        if (user === null) {
                            Alert.alert(
                                'Login Required',
                                'Please login to add items to your cart.',
                                [
                                    {
                                        text: "OK",
                                        onPress: () => {
                                            router.push("/(auth)/loginSignup");
                                        }
                                    }
                                ]
                            );
                            return;
                        }
                        addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            imageUrl: product.imageUrl,
                            quantity: quantity,
                            category: product.category
                        });
                        Alert.alert(
                            'Success',
                            'Item added to cart successfully!',
                            [{ text: 'OK' }]
                        );
                    }}
                >
                    <Ionicons name="cart-outline" size={24} color="#FFF" />
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buyNowButton}>
                    <Text style={styles.buyNowText}>Buy Now</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default SingleProductPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    customHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    errorText: {
        fontSize: 16,
        color: '#6B7280',
    },
    imageContainer: {
        height: 300,
        backgroundColor: '#FFF',
        width: '100%',
        overflow: 'hidden',
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    detailsContainer: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -20,
        padding: 20,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 12,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4F46E5',
        textTransform: 'uppercase',
    },
    productName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
        lineHeight: 32,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginLeft: 6,
    },
    reviewText: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    price: {
        fontSize: 32,
        fontWeight: '700',
        color: '#4F46E5',
    },
    stockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    stockDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
        marginRight: 6,
    },
    stockText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#059669',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        color: '#6B7280',
        lineHeight: 24,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    quantityButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#4F46E5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1F2937',
        minWidth: 40,
        textAlign: 'center',
    },
    featuresList: {
        gap: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureText: {
        fontSize: 15,
        color: '#1F2937',
        fontWeight: '500',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    addToCartButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#4F46E5',
        paddingVertical: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    addToCartText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
    buyNowButton: {
        flex: 1,
        backgroundColor: '#1F2937',
        paddingVertical: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buyNowText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
});