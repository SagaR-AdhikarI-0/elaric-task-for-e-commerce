import Card from '@/components/client/Card'
import { useAuth } from '@/Context/authContext'
import { db } from '@/firebaseConfig'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { collection, getDocs, limit, query } from "firebase/firestore"
import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
const { width } = Dimensions.get('window')

const index = () => {
    const scrollViewRef = useRef<ScrollView>(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [allItems, setAllItems] = useState<any[]>([])
    const sliderImages = [
        'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
        'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    ]

    const brands = [
        { id: 1, name: 'Nike', logo: 'Nik', color: '#6f564cff' },
        { id: 2, name: 'Adidas', logo: '⚡', color: '#004D98' },
        { id: 3, name: 'Apple', logo: 'A', color: '#be4141ff' },
        { id: 4, name: 'Samsung', logo: '📱', color: '#1428A0' },
        { id: 5, name: 'Sony', logo: '🎮', color: '#003087' },
        { id: 6, name: 'Puma', logo: '🐆', color: '#000000' },
    ]

    useEffect(() => {
        const getProducts = async () => {
            const q = query(collection(db, "products"), limit(6));
            const data = await getDocs(q);
            const items = data.docs.map(item => ({ id: item.id, ...item.data() }));
            console.log("firebase ko data:", items);
            setAllItems(items);
        }
        getProducts()
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % sliderImages.length
                scrollViewRef.current?.scrollTo({
                    x: nextIndex * width,
                    animated: true,
                })
                return nextIndex
            })
        }, 6000)

        return () => clearInterval(interval)
    }, [])
    const { role } = useAuth()
    return (
        <SafeAreaView style={styles.container}>


            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.searchContainer}>
                    <TouchableOpacity style={styles.searchButton} onPress={() => router.push('products/search')} >
                        <Text style={{ width: "72%", backgroundColor: "white", height: '100%', textAlignVertical: 'center', paddingLeft: 10, color: "#4c9b94ff" }} > Search items here....</Text>
                        <Text style={{ color: "blue", paddingHorizontal: 10 }}>Search   <Ionicons name="search" size={20} color="#4F46E5" /></Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.sliderContainer}>
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={width}
                        decelerationRate="fast"
                        onMomentumScrollEnd={(event) => {
                            const index = Math.round(event.nativeEvent.contentOffset.x / width)
                            setCurrentIndex(index)
                        }}
                        style={styles.slider}
                    >
                        {sliderImages.map((image, index) => (
                            <View key={index} style={styles.slide}>
                                <Image
                                    source={{ uri: image }}
                                    style={styles.sliderImage}
                                    contentFit="cover"
                                />
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.pagination}>
                        {sliderImages.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    index === currentIndex && styles.paginationDotActive,
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* Brands Section */}
                <View style={styles.brandsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Shop by Brand</Text>
                        <TouchableOpacity onPress={() => router.push('/products/allproducts')}>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.brandsContainer}
                    >
                        {brands.map((brand) => (
                            <TouchableOpacity
                                key={brand.id}
                                style={styles.brandCard}
                                activeOpacity={0.7}
                                onPress={() => { }}
                            >
                                <View style={[styles.brandLogo, { backgroundColor: brand.color }]}>
                                    <Text style={styles.brandEmoji}>{brand.logo}</Text>
                                </View>
                                <Text style={styles.brandName}>{brand.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.productSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Our Products</Text>
                        <TouchableOpacity onPress={() => router.push('/products/allproducts')}>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={allItems}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => router.push(`/products/${item.id}`)}>
                                <Card
                                    name={item.name}
                                    image={item.imageUrl}
                                    price={item.price}
                                    brand={item.category}
                                />
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                        columnWrapperStyle={styles.productRow}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        style={{ paddingHorizontal: 16 }}
                    />
                </View>

                {/* Customer Review Section */}
                <View style={styles.reviewSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Customer Reviews</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                            <View style={styles.reviewStars}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Ionicons key={star} name="star" size={18} color="#FCD34D" />
                                ))}
                            </View>
                            <Text style={styles.ratingText}>5.0</Text>
                        </View>

                        <Text style={styles.reviewText}>
                            "Amazing shopping experience! The product quality exceeded my expectations and the delivery was super fast. Highly recommend!"
                        </Text>

                        <View style={styles.reviewFooter}>
                            <View style={styles.reviewAvatar}>
                                <Ionicons name="person" size={20} color="#FFF" />
                            </View>
                            <View style={styles.reviewInfo}>
                                <Text style={styles.reviewName}>Rajesh Kumar</Text>
                                <View style={styles.verifiedBadge}>
                                    <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                                    <Text style={styles.reviewDate}>Verified Buyer</Text>
                                </View>
                            </View>
                            <Text style={styles.reviewTime}>2d ago</Text>
                        </View>
                    </View>
                </View>

                {/* Why Choose Us Section */}
                <View style={styles.featuresSection}>
                    <Text style={styles.sectionTitle}>Why Choose Us</Text>

                    <View style={styles.featuresGrid}>
                        <View style={styles.featureCard}>
                            <View style={[styles.featureIcon, { backgroundColor: '#DBEAFE' }]}>
                                <Ionicons name="rocket" size={28} color="#3B82F6" />
                            </View>
                            <Text style={styles.featureTitle}>Fast Delivery</Text>
                            <Text style={styles.featureDescription}>Quick shipping across Nepal</Text>
                        </View>

                        <View style={styles.featureCard}>
                            <View style={[styles.featureIcon, { backgroundColor: '#DCFCE7' }]}>
                                <Ionicons name="shield-checkmark" size={28} color="#10B981" />
                            </View>
                            <Text style={styles.featureTitle}>Quality Assured</Text>
                            <Text style={styles.featureDescription}>100% authentic products</Text>
                        </View>

                        <View style={styles.featureCard}>
                            <View style={[styles.featureIcon, { backgroundColor: '#FEF3C7' }]}>
                                <Ionicons name="return-down-back" size={28} color="#F59E0B" />
                            </View>
                            <Text style={styles.featureTitle}>Easy Returns</Text>
                            <Text style={styles.featureDescription}>7-day return policy</Text>
                        </View>

                        <View style={styles.featureCard}>
                            <View style={[styles.featureIcon, { backgroundColor: '#FCE7F3' }]}>
                                <Ionicons name="headset" size={28} color="#EC4899" />
                            </View>
                            <Text style={styles.featureTitle}>24/7 Support</Text>
                            <Text style={styles.featureDescription}>Always here to help</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Floating Admin Button */}
            {role === 'admin' && (
                <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={() => router.push('/(adminScreens)/home')}
                    activeOpacity={0.8}
                > <Text style={{ color: '#FFF', fontWeight: '600' }}> Go to Admin Panel</Text>
                    <Ionicons name="shield-checkmark" size={28} color="#FFF" />
                </TouchableOpacity>
            )}

        </SafeAreaView>
    )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    searchContainer: {
        margin: 10,
    },
    searchBar: {
        borderRadius: 20,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        paddingRight: 50,
        backgroundColor: '#fff',
        height: 40,

    },
    searchButton: {
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        borderBottomRightRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E0E7FF',
        borderWidth: 2,
        borderColor: '#A5B4FC',
    },
    sliderContainer: {
        marginVertical: 15,
    },
    slider: {
        height: 180,
        borderRadius: 16,
        overflow: 'hidden',
    },
    slide: {
        width: width,
        height: 180,
        paddingHorizontal: 10,
    },
    sliderImage: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D1D5DB',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#4F46E5',
        width: 24,
    },
    brandsSection: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4F46E5',
    },
    brandsContainer: {
        paddingHorizontal: 16,
        gap: 12,
    },
    brandCard: {
        alignItems: 'center',
        marginRight: 15,
    },
    brandLogo: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    brandEmoji: {
        fontSize: 32,
        color: '#c1cbddff',
    },
    brandName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
    },
    productSection: {
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: '#f2f7faff',
    },
    productRow: {
        justifyContent: 'flex-start',
        marginBottom: 16,
        gap: 15,
    },
    reviewSection: {
        marginTop: 20,
        marginBottom: 30,
        paddingHorizontal: 16,
    },
    reviewCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    reviewStars: {
        flexDirection: 'row',
        gap: 2,
    },
    ratingText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginLeft: 4,
    },
    reviewText: {
        fontSize: 16,
        color: '#374151',
        lineHeight: 26,
        marginBottom: 20,
    },
    reviewFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    reviewAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4F46E5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reviewInfo: {
        flex: 1,
    },
    reviewName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    reviewDate: {
        fontSize: 13,
        color: '#10B981',
        fontWeight: '500',
    },
    reviewTime: {
        fontSize: 13,
        color: '#9CA3AF',
    },
    featuresSection: {
        marginTop: 20,
        marginBottom: 30,
        paddingHorizontal: 16,
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 16,
    },
    featureCard: {
        width: '48%',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    featureIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 6,
        textAlign: 'center',
    },
    featureDescription: {
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 18,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        flexDirection: 'row', paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 8,
        borderRadius: 30,
        backgroundColor: '#4F46E5',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
})