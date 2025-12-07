import Card from '@/components/client/Card';
import { db } from '@/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    imageUrl: string;
}

const allproducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const productsRef = collection(db, 'products');
            const snapshot = await getDocs(productsRef);
            const productsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Product[];
            setProducts(productsList);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchProducts();
    };

    const renderProduct = ({ item, index }: { item: Product; index: number }) => (
        <TouchableOpacity
            onPress={() => router.push(`/products/${item.id}`)}
            activeOpacity={0.7}
            style={[
                styles.cardWrapper,
                (index + 1) % 3 === 0 && styles.cardWrapperLast
            ]}
        >
            <Card
                name={item.name}
                image={item.imageUrl}
                price={item.price}
                brand={item.category}
            />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text style={styles.loadingText}>Loading products...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>All Products</Text>
                <Text style={styles.countText}>
                    {products.length} {products.length === 1 ? 'Product' : 'Products'}
                </Text>
            </View>
            {products.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cube-outline" size={80} color="#D1D5DB" />
                    <Text style={styles.emptyText}>No products available</Text>
                    <Text style={styles.emptySubtext}>Check back later for new items</Text>
                </View>
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    columnWrapperStyle={styles.productRow}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            )}
        </SafeAreaView>
    );
};

export default allproducts;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#6B7280',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        marginBottom: 16
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    countContainer: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomColor: '#E5E7EB',
    },
    countText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    listContent: {
        paddingHorizontal: 16,
    },
    cardWrapper: {
        marginBottom: 20,
        maxWidth: '30%',
    },
    cardWrapperLast: {
        marginRight: 0,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1F2937',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 8,
        textAlign: 'center',
    },
    productRow: {
        justifyContent: 'flex-start',
        marginBottom: 16,
        gap: 18,
    }
});