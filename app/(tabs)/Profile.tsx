import Button from '@/components/Button'
import { useAuth } from '@/Context/authContext'
import { updateUserProfile } from '@/services/authService'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editImage, setEditImage] = useState('');
    const [loading, setLoading] = useState(false);

    const menuOptions = [
        { id: 1, title: 'Shopping Address', icon: 'location', onPress: () => { } },
        { id: 2, title: 'Order History', icon: 'receipt', onPress: () => { } },
        { id: 3, title: 'Wishlist', icon: 'heart', onPress: () => { } },
        { id: 4, title: 'Payment Methods', icon: 'card', onPress: () => { } },
        { id: 5, title: 'Notifications', icon: 'notifications', onPress: () => { } },
        { id: 6, title: 'Help Center', icon: 'help-circle', onPress: () => { } },
        { id: 7, title: 'About Us', icon: 'information-circle', onPress: () => { } },
        { id: 8, title: 'Terms & Conditions', icon: 'document-text', onPress: () => { } },
        { id: 9, title: 'Privacy Policy', icon: 'shield-checkmark', onPress: () => { } },
        { id: 10, title: 'Settings', icon: 'settings', onPress: () => { } },
    ]
    const { user, logout, role } = useAuth();

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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                </View>
                {user ? (
                    <>
                        {isEditing ? (
                            <View style={styles.editContainer}>
                                <TouchableOpacity style={styles.editImageContainer} onPress={pickImage}>
                                    {editImage ? (
                                        <Image
                                            source={{ uri: editImage }}
                                            style={styles.profileImage}
                                            contentFit="cover"
                                        />
                                    ) : (
                                        <View style={styles.profileImagePlaceholder}>
                                            <Ionicons name="person" size={40} color="#4F46E5" />
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
                        ) : role !== 'admin' && (
                            <View style={styles.userInfoContainer}>
                                <View style={styles.profileImageContainer}>
                                    {user.photoURL ? (
                                        <Image
                                            source={{ uri: user.photoURL }}
                                            style={styles.profileImage}
                                            contentFit="cover"
                                        />
                                    ) : (
                                        <View style={styles.profileImagePlaceholder}>
                                            <Ionicons name="person" size={40} color="#4F46E5" />
                                        </View>
                                    )}
                                </View>
                                <View style={styles.userTextContainer}>
                                    <View style={styles.greetingRow}>
                                        <Text style={styles.greeting}>Hi, {user.displayName || 'User'}</Text>
                                        <TouchableOpacity
                                            style={styles.editIconButton}
                                            onPress={handleEdit}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons name="create-outline" size={18} color="#4F46E5" />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.email}>{user.email}</Text>
                                </View>
                            </View>
                        )}
                    </>
                ) :
                    <View style={styles.loginSignupContainer}>
                        <Button text="Signup" onPress={() => router.push('/(auth)/loginSignup?required=signup')} backgroundColor='#4F46E5' textColor='white' />
                        <Button text="Login" onPress={() => router.push('/(auth)/loginSignup?required=login')} />
                    </View>
                }

                {user && role === 'admin' && !isEditing && (
                    <TouchableOpacity
                        style={styles.adminPanelButton}
                        onPress={() => router.push('/(adminScreens)/home')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.adminPanelContent}>
                            <View style={styles.adminIconContainer}>
                                <Ionicons name="business" size={24} color="#FFF" />
                            </View>
                            <View style={styles.adminTextContainer}>
                                <Text style={styles.adminPanelTitle}>Admin Panel</Text>
                                <Text style={styles.adminPanelSubtitle}>Manage your store</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#FFF" />
                    </TouchableOpacity>
                )}

                {!isEditing && (
                    <View style={styles.menuSection}>
                        {menuOptions.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                style={styles.menuItem}
                                onPress={option.onPress}
                                activeOpacity={0.7}
                            >
                                <View style={styles.menuItemLeft}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name={option.icon as any} size={22} color="#4F46E5" />
                                    </View>
                                    <Text style={styles.menuItemText}>{option.title}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {user && !isEditing && (
                    <View style={styles.logoutContainer}>
                        <Button
                            text="Logout"
                            onPress={() => logout()}
                            backgroundColor='#EF4444'
                            textColor='white'
                            borderColor='#EF4444'
                        />
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    loginSignupContainer: {
        marginTop: 50,
        display: 'flex',
        gap: 10,
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    menuSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuItemText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1F2937',
    },
    logoutContainer: {
        marginTop: 10,
        marginBottom: 30,
    },
    greetingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    greeting: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    editIconButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    email: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '400',
        marginTop: 4,
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginTop: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    profileImageContainer: {
        marginRight: 16,
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 3,
        borderColor: '#4F46E5',
    },
    profileImagePlaceholder: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#4F46E5',
    },
    userTextContainer: {
        flex: 1,
    },
    editContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        marginTop: 20,
        marginBottom: 30,
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
    adminPanelButton: {
        backgroundColor: '#4F46E5',
        borderRadius: 16,
        padding: 20,
        marginTop: 10,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    adminPanelContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    adminIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    adminTextContainer: {
        flex: 1,
    },
    adminPanelTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 4,
    },
    adminPanelSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
});
