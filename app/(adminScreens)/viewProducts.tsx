import { db } from '@/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    description: string;
    imageUrl: string;
}

const viewProducts = () => {
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
            Alert.alert('Error', 'Failed to fetch products');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchProducts();
    };

    const handleDelete = (productId: string, productName: string) => {
        Alert.alert(
            'Delete Product',
            `Are you sure you want to delete "${productName}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'products', productId));
                            setProducts(products.filter(p => p.id !== productId));
                            Alert.alert('Success', 'Product deleted successfully');
                        } catch (error) {
                            console.error('Error deleting product:', error);
                            Alert.alert('Error', 'Failed to delete product');
                        }
                    }
                }
            ]
        );
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <View style={styles.productCard}>
            <Image
                source={{ uri: item.imageUrl }}
                style={styles.productImage}
                contentFit="cover"
            />
            <View style={styles.productDetails}>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.productCategory}>{item.category}</Text>
                <Text style={styles.productPrice}>रु {item.price}</Text>
            </View>
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => router.push(`/(adminScreens)/EditProduct?id=${item.id}`)}
                >
                    <Ionicons name="create-outline" size={20} color="#4F46E5" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(item.id, item.name)}
                >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
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
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push('/(adminScreens)/AddProducts')}
                >
                    <Ionicons name="add" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* Products Count */}
            <View style={styles.countContainer}>
                <Text style={styles.countText}>
                    {products.length} {products.length === 1 ? 'Product' : 'Products'}
                </Text>
            </View>

            {/* Products List */}
            {products.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cube-outline" size={80} color="#D1D5DB" />
                    <Text style={styles.emptyText}>No products found</Text>
                    <Text style={styles.emptySubtext}>Add your first product to get started</Text>
                    <TouchableOpacity
                        style={styles.emptyButton}
                        onPress={() => router.push('/(adminScreens)/AddProducts')}
                    >
                        <Text style={styles.emptyButtonText}>Add Product</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            )}
        </SafeAreaView>
    );
};

export default viewProducts;

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
        paddingVertical: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
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
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4F46E5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    countContainer: {
        paddingHorizontal: 20,
        paddingVertical: 12,

    },
    countText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    listContent: {
        padding: 16,
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    productDetails: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    productCategory: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4F46E5',
    },
    actionsContainer: {
        justifyContent: 'center',
        gap: 8,
        marginLeft: 8,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#EEF2FF',
    },
    deleteButton: {
        backgroundColor: '#FEE2E2',
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
    emptyButton: {
        marginTop: 24,
        backgroundColor: '#4F46E5',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    emptyButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
});