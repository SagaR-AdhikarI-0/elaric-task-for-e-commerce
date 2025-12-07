import { useAuth } from '@/Context/authContext';
import { updateUserProfile } from '@/services/authService';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const home = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editImage, setEditImage] = useState('');
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setEditImage(result.assets[0].uri);
        }
    };

    const uploadToCloudinary = async (uri: string): Promise<string> => {
        try {
            const formData = new FormData();
            formData.append("file", {
                uri,
                type: "image/jpeg",
                name: "profile.jpg",
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

    const handleEdit = () => {
        setEditName(user?.displayName || '');
        setEditImage(user?.photoURL || '');
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditName('');
        setEditImage('');
    };

    const handleSave = async () => {
        if (!editName.trim()) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        if (!user) return;

        try {
            setLoading(true);

            let imageUrl = editImage;
            if (editImage !== user.photoURL && editImage.startsWith('file://')) {
                imageUrl = await uploadToCloudinary(editImage);
            }

            await updateUserProfile(user.uid, editName, imageUrl);

            Alert.alert('Success', 'Profile updated successfully!');
            setIsEditing(false);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const adminOptions = [
        {
            id: 1,
            title: 'Add Product',
            description: 'Add new products to store',
            icon: 'add-circle',
            color: '#4F46E5',
            route: '/(adminScreens)/AddProducts'
        },
        {
            id: 2,
            title: 'View Products',
            description: 'Manage your products',
            icon: 'grid',
            color: '#10B981',
            route: '/(adminScreens)/viewProducts'
        },
        {
            id: 3,
            title: 'Orders',
            description: 'View and manage orders',
            icon: 'receipt',
            color: '#F59E0B',
            route: '/(adminScreens)/Orders'
        },
        {
            id: 4,
            title: 'Customers',
            description: 'View customer list',
            icon: 'people',
            color: '#EC4899',
            route: '/(adminScreens)/Customers'
        },
        {
            id: 5,
            title: 'Analytics',
            description: 'View sales analytics',
            icon: 'stats-chart',
            color: '#8B5CF6',
            route: '/(adminScreens)/Analytics'
        },
        {
            id: 6,
            title: 'Settings',
            description: 'App settings & preferences',
            icon: 'settings',
            color: '#6B7280',
            route: '/(adminScreens)/Settings'
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {isEditing ? (
                    <View style={styles.editProfileContainer}>
                        <TouchableOpacity style={styles.editImageContainer} onPress={pickImage}>
                            {editImage ? (
                                <Image
                                    source={{ uri: editImage }}
                                    style={styles.adminProfileImage}
                                    contentFit="cover"
                                />
                            ) : (
                                <View style={styles.adminProfileImagePlaceholder}>
                                    <Ionicons name="person" size={50} color="#4F46E5" />
                                </View>
                            )}
                            <View style={styles.cameraIcon}>
                                <Ionicons name="camera" size={20} color="#FFF" />
                            </View>
                        </TouchableOpacity>

                        <View style={styles.editInputContainer}>
                            <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                style={styles.editInput}
                                placeholder="Full Name"
                                placeholderTextColor="#9CA3AF"
                                value={editName}
                                onChangeText={setEditName}
                                autoCapitalize="words"
                            />
                        </View>

                        <View style={styles.editButtonsContainer}>
                            <TouchableOpacity
                                style={[styles.editActionButton, styles.cancelButton]}
                                onPress={handleCancel}
                                disabled={loading}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.editActionButton, styles.saveButton]}
                                onPress={handleSave}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <Text style={styles.saveButtonText}>Save</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.header}>
                        <View style={styles.profileSection}>
                            <View style={styles.profileImageContainer}>
                                {user?.photoURL ? (
                                    <Image
                                        source={{ uri: user.photoURL }}
                                        style={styles.adminProfileImage}
                                        contentFit="cover"
                                    />
                                ) : (
                                    <View style={styles.adminProfileImagePlaceholder}>
                                        <Ionicons name="person" size={50} color="#4F46E5" />
                                    </View>
                                )}
                            </View>
                            <View style={styles.headerTextContainer}>
                                <View style={styles.greetingRow}>
                                    <Text style={styles.greeting}>Hello, {user?.displayName || 'Admin'} 👋</Text>

                                </View>
                                <Text style={styles.subtitle}>Manage your store</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.editHeaderButton}
                            onPress={handleEdit}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="create-outline" size={16} color="#4F46E5" />
                        </TouchableOpacity>
                    </View>
                )}

                <Text style={styles.sectionTitle}>Quick Actions</Text>

                <View style={styles.optionsGrid}>
                    {adminOptions.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={styles.optionCard}
                            onPress={() => router.push(option.route as any)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: option.color + '20' }]}>
                                <Ionicons name={option.icon as any} size={28} color={option.color} />
                            </View>
                            <Text style={styles.optionTitle}>{option.title}</Text>
                            <Text style={styles.optionDescription}>{option.description}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {!isEditing && (
                    <TouchableOpacity
                        style={styles.clientViewButton}
                        onPress={() => router.push('/(tabs)')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.clientViewContent}>
                            <View style={styles.clientViewIconContainer}>
                                <Ionicons name="storefront" size={24} color="#FFF" />
                            </View>
                            <View style={styles.clientViewTextContainer}>
                                <Text style={styles.clientViewTitle}>Go to Client View</Text>
                                <Text style={styles.clientViewSubtitle}>View app as customer</Text>
                            </View>
                        </View>
                        <Ionicons name="arrow-forward" size={24} color="#FFF" />
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFF',
        borderBottomColor: '#E5E7EB',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    profileImageContainer: {
        marginRight: 12,
    },
    adminProfileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#4F46E5',
    },
    adminProfileImagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#4F46E5',
    },
    headerTextContainer: {
        flex: 1,
    },
    greetingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    editHeaderButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    subtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        paddingHorizontal: 20,
        marginTop: 8,
        marginBottom: 16,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 12,
        paddingBottom: 24,
    },
    optionCard: {
        width: (width - 44) / 2,
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
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
        textAlign: 'center',
    },
    optionDescription: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 16,
    },
    editProfileContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        marginTop: 20,
        marginHorizontal: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    editImageContainer: {
        alignSelf: 'center',
        marginBottom: 24,
        position: 'relative',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#4F46E5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    editInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    editInput: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
    editButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    editActionButton: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
    saveButton: {
        backgroundColor: '#4F46E5',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
    clientViewButton: {
        backgroundColor: '#103db9ff',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 16,
        marginTop: 10,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    clientViewContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    clientViewIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    clientViewTextContainer: {
        flex: 1,
    },
    clientViewTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 4,
    },
    clientViewSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
});
