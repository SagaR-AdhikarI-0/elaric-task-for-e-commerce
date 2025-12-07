import Card from '@/components/client/Card'
import { db } from '@/firebaseConfig'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { collection, getDocs } from 'firebase/firestore'
import React, { useState } from 'react'
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const search = () => {
    const [searchValue, setSearchValue] = useState("")
    const [searchItems, setSearchItems] = useState([])
    const [loading, setLoading] = useState(false)

    const recommendedItems = ['Shoes', 'Electronics', 'Watches', 'Accessories', 'Gaming'];
    const handleRecommendedClick = (category: string) => {
        setSearchValue(category);
    };

    const handleSearchPress = async () => {
        if (!searchValue.trim()) {
            console.log("no values");

            return;
        }

        try {
            setLoading(true);
            const productsRef = collection(db, "products");

            // Get all products
            const allProductsSnapshot = await getDocs(productsRef);
            const allProducts = allProductsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Filter products by name or category (case-insensitive)
            const searchLower = searchValue.toLowerCase();
            const filteredProducts = allProducts.filter((product: any) => {
                const nameMatch = product.name?.toLowerCase().includes(searchLower);
                const categoryMatch = product.category?.toLowerCase().includes(searchLower);
                return nameMatch || categoryMatch;
            });

            setSearchItems(filteredProducts as any);
            console.log("Search results:", filteredProducts);
        } catch (error) {
            console.error("Error searching products:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search items here...."
                        placeholderTextColor="#4c9b94ff"
                        value={searchValue}
                        onChangeText={setSearchValue}
                        autoFocus
                    />
                    <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
                        <Text style={{ color: "blue" }}>Search</Text>
                        <Ionicons name="search" size={20} color="#4F46E5" />
                    </TouchableOpacity>
                </View>
            </View>
            {searchItems.length <= 0 ? (
                <>
                    <View style={styles.recommendedSection}>
                        <Text style={styles.recommendedTitle}>Recommended Items</Text>
                        <View style={styles.recommendedItems}>
                            {recommendedItems.map((category, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.recommendedItem}
                                    onPress={() => handleRecommendedClick(category)}
                                >
                                    <Text style={styles.recommendedItemText}>{category}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <View>
                        <Text style={{ textAlign: 'center', marginTop: 20, color: '#6B7280' }}>No search results to display.</Text>
                    </View>
                </>) : (
                <View>
                    <Text style={{ marginVertical: 10, fontSize: 24, fontWeight: '600' }}> Search Results</Text>
                    <FlatList
                        data={searchItems}
                        renderItem={({ item }: any) => (
                            <TouchableOpacity onPress={() => router.push(`/products/${item.id}`)}>
                                <Card
                                    name={item.name}
                                    image={item.imageUrl}
                                    price={item.price}
                                    brand={item.category}
                                />
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item: any) => item.id}
                        numColumns={3}
                        columnWrapperStyle={styles.productRow}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                    />

                </View>
            )
            }

        </SafeAreaView>
    )
}

export default search

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
        gap: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputContainer: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E0E7FF',
        borderWidth: 2,
        borderColor: '#A5B4FC',
    },
    searchInput: {
        flex: 1,
        marginTop: 4,
        fontSize: 15,
        color: '#1F2937',
        backgroundColor: 'white',
        height: '100%',
        paddingLeft: 16,
    },
    searchButton: {
        paddingHorizontal: 12,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 6,
    },
    recommendedSection: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    recommendedTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
    },
    recommendedItems: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    recommendedItem: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#EEF2FF',
        borderWidth: 2,
        borderColor: '#A5B4FC',
    },
    recommendedItemText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4F46E5',
    },
    productSection: {
        marginTop: 20,
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    productRow: {
        justifyContent: 'flex-start',
        marginBottom: 16,
        gap: 8,
    }
})