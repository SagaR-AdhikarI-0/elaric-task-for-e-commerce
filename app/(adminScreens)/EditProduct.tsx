import { db } from '@/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const EditProduct = () => {
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [imageUri, setImageUri] = useState('');
    const [newImageUri, setNewImageUri] = useState('');

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const docRef = doc(db, 'products', id as string);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setName(data.name || '');
                setPrice(data.price?.toString() || '');
                setCategory(data.category || '');
                setDescription(data.description || '');
                setImageUri(data.imageUrl || '');
            } else {
                Alert.alert('Error', 'Product not found');
                router.back();
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            Alert.alert('Error', 'Failed to fetch product');
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setNewImageUri(result.assets[0].uri);
        }
    };

    const uploadToCloudinary = async (uri: string): Promise<string> => {
        try {
            const formData = new FormData();
            formData.append("file", {
                uri,
                type: "image/jpeg",
                name: "upload.jpg",
            } as any);

            formData.append("upload_preset", "images_from_micro_ecommerce");

            const response = await fetch(
                "https://api.cloudinary.com/v1_1/dsnbjmnxn/image/upload",
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status}`);
            }

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            throw error;
        }
    };

    const handleUpdate = async () => {
        // Validation
        if (!name || !price || !category || !description) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            setUpdating(true);

            let finalImageUrl = imageUri;

            // Upload new image if selected
            if (newImageUri) {
                finalImageUrl = await uploadToCloudinary(newImageUri);
            }

            // Update product in Firestore
            const productRef = doc(db, 'products', id as string);
            await updateDoc(productRef, {
                name,
                price: parseFloat(price),
                category,
                description,
                imageUrl: finalImageUrl,
            });

            Alert.alert('Success', 'Product updated successfully', [
                {
                    text: 'OK',
                    onPress: () => router.back()
                }
            ]);
        } catch (error) {
            console.error('Error updating product:', error);
            Alert.alert('Error', 'Failed to update product');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <Modal visible transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#4F46E5" />
                        <Text style={styles.loadingText}>Loading product...</Text>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <Modal visible transparent animationType="slide">
            <View style={styles.modalOverlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalContent}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => router.back()}>
                                <Ionicons name="close" size={28} color="#1F2937" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Edit Product</Text>
                            <View style={{ width: 28 }} />
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            {/* Image Picker */}
                            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                                {newImageUri || imageUri ? (
                                    <Image
                                        source={{ uri: newImageUri || imageUri }}
                                        style={styles.productImage}
                                        contentFit="cover"
                                    />
                                ) : (
                                    <View style={styles.imagePlaceholder}>
                                        <Ionicons name="image-outline" size={48} color="#9CA3AF" />
                                        <Text style={styles.imagePlaceholderText}>Tap to change image</Text>
                                    </View>
                                )}
                                <View style={styles.imageOverlay}>
                                    <Ionicons name="camera" size={24} color="#FFF" />
                                    <Text style={styles.imageOverlayText}>Change Photo</Text>
                                </View>
                            </TouchableOpacity>

                            {/* Form Fields */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Product Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter product name"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Price (रु)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter price"
                                    value={price}
                                    onChangeText={setPrice}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Category</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter category"
                                    value={category}
                                    onChangeText={setCategory}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Description</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Enter product description"
                                    value={description}
                                    onChangeText={setDescription}
                                    multiline
                                    numberOfLines={4}
                                />
                            </View>

                            {/* Update Button */}
                            <TouchableOpacity
                                style={[styles.updateButton, updating && styles.updateButtonDisabled]}
                                onPress={handleUpdate}
                                disabled={updating}
                            >
                                {updating ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <>
                                        <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                                        <Text style={styles.updateButtonText}>Update Product</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

export default EditProduct;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        paddingBottom: 20,
    },
    loadingContainer: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        margin: 20,
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
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    scrollContent: {
        padding: 20,
    },
    imagePicker: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 24,
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholderText: {
        marginTop: 8,
        fontSize: 14,
        color: '#9CA3AF',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        gap: 8,
    },
    imageOverlayText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1F2937',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    updateButton: {
        backgroundColor: '#4F46E5',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
    },
    updateButtonDisabled: {
        opacity: 0.6,
    },
    updateButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
    },
});