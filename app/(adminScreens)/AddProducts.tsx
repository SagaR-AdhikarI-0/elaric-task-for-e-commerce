import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addProduct } from '../../services/productService';

export default function App() {
    const [image, setImage] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            console.log('Selected imageuri', result.assets[0].uri);
            setImage(result.assets[0].uri);
        }
    };

    const handleSaveProduct = async () => {
        // Validation
        if (!image || !name || !price || !category || !description) {
            Alert.alert('Error', 'Please fill all fields and upload an image');
            return;
        }

        if (isNaN(parseFloat(price))) {
            Alert.alert('Error', 'Please enter a valid price');
            return;
        }

        try {
            setLoading(true);
            const productId = await addProduct(name, price, category, description, image);

            Alert.alert(
                'Success',
                'Product added successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setImage(null);
                            setName('');
                            setPrice('');
                            setCategory('');
                            setDescription('');
                        }
                    }
                ]
            );
            console.log('Product added with ID:', productId);
        } catch (error) {
            Alert.alert('Error', 'Failed to add product. Please try again.');
            console.error('Error saving product:', error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add New Product</Text>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#1F2937" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >

                    {/* image upload ko section */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Product Image</Text>
                        <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                            {image ? (
                                <Image
                                    source={{ uri: image }}
                                    style={styles.imagePreview}
                                    contentFit='cover'
                                    placeholder={null}
                                    transition={200}
                                />

                            ) : (
                                <View style={styles.uploadBox}>
                                    <View style={styles.iconCircle}>
                                        <Ionicons name="camera-outline" size={32} color="#4F46E5" />
                                    </View>
                                    <Text style={styles.uploadText}>Upload Product Image</Text>
                                    <Text style={styles.uploadSubText}>PNG, JPG up to 10MB</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Product Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Nike Air Max"
                                placeholderTextColor="#9CA3AF"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                                <Text style={styles.label}>Price ($)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0.00"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="numeric"
                                    value={price}
                                    onChangeText={setPrice}
                                />
                            </View>

                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                                <Text style={styles.label}>Category</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Eg: Shoes, Clothing"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="default"
                                    value={category}
                                    onChangeText={setCategory}
                                />
                            </View>
                        </View>

                        {/* Description */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Enter product details..."
                                placeholderTextColor="#9CA3AF"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                value={description}
                                onChangeText={setDescription}
                            />
                        </View>

                    </View>

                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                        onPress={handleSaveProduct}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.saveButtonText}>Save Product</Text>
                        )}
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100, // Space for the footer
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    // Image Upload Styles
    uploadBox: {
        height: 180,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#EEF2FF', // Light Indigo
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    uploadText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4B5563',
    },
    uploadSubText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    },
    imagePreviewContainer: {
        height: 250,
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: '#000',
        backgroundColor: '#b83a3aff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginVertical: 10,
        borderRadius: 16,
        marginBottom: 20,
        backgroundColor: '#ddeefaff',
        objectFit: "contain"
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        backgroundColor: '#4F46E5',
        padding: 10,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    // Form Styles
    inputGroup: {
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: '#1F2937',
    },
    dropdownInput: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inputText: {
        fontSize: 15,
        color: '#1F2937',
    },
    placeholderText: {
        fontSize: 15,
        color: '#9CA3AF',
    },
    textArea: {
        height: 120,
        paddingTop: 12,
    },
    // Footer Styles
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    saveButton: {
        backgroundColor: '#4F46E5', // Indigo 600
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});