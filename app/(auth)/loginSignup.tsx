import { useAuth } from '@/Context/authContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const loginSignup = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState('');
    const params = useLocalSearchParams();
    const { signIn, signUp } = useAuth();
    useEffect(() => {
        if (params.required === 'signup') {
            setIsLogin(false);
        } else {
            setIsLogin(true);
        }
    }, []);

    const handleSubmit = async () => {
        // Validation
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (!isLogin && !name) {
            Alert.alert('Error', 'Please enter your name');
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        try {
            setLoading(true);
            if (isLogin) {
                await signIn(email, password);
                Alert.alert('Success', 'Logged in successfully!');
                router.replace('/(tabs)');
            } else {
                // Upload profile image if provided
                let imageUrl = '';
                if (profileImage) {
                    imageUrl = await uploadToCloudinary(profileImage);
                }

                await signUp(email, password, name, imageUrl);
                Alert.alert('Success', 'Account created successfully!');
                router.replace('/(tabs)');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setProfileImage('');
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
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

    return (
        <SafeAreaView style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.replace('/(tabs)')}
            >
                <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </Text>
                        <Text style={styles.subtitle}>
                            {isLogin
                                ? 'Sign in to continue shopping'
                                : 'Sign up to start shopping'}
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formContainer}>
                        {/* Profile Image (Only for Signup) */}
                        {!isLogin && (
                            <TouchableOpacity style={styles.imagePickerContainer} onPress={pickImage}>
                                {profileImage ? (
                                    <Image
                                        source={{ uri: profileImage }}
                                        style={styles.profileImage}
                                        contentFit="cover"
                                    />
                                ) : (
                                    <View style={styles.imagePlaceholder}>
                                        <Ionicons name="person-add" size={40} color="#9CA3AF" />
                                        <Text style={styles.imagePlaceholderText}>Add Profile Photo</Text>
                                    </View>
                                )}
                                <View style={styles.cameraIcon}>
                                    <Ionicons name="camera" size={20} color="#FFF" />
                                </View>
                            </TouchableOpacity>
                        )}

                        {/* Name Input (Only for Signup) */}
                        {!isLogin && (
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Full Name"
                                    placeholderTextColor="#9CA3AF"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                />
                            </View>
                        )}

                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#9CA3AF"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#9CA3AF"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={20}
                                    color="#6B7280"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Confirm Password (Only for Signup) */}
                        {!isLogin && (
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm Password"
                                    placeholderTextColor="#9CA3AF"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                            </View>
                        )}

                        {/* Forgot Password (Only for Login) */}
                        {isLogin && (
                            <TouchableOpacity style={styles.forgotPassword}>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        )}

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.submitButtonText}>
                                    {isLogin ? 'Sign In' : 'Sign Up'}
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* Toggle Mode */}
                        <View style={styles.toggleContainer}>
                            <Text style={styles.toggleText}>
                                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                            </Text>
                            <TouchableOpacity onPress={toggleMode}>
                                <Text style={styles.toggleLink}>
                                    {isLogin ? 'Sign Up' : 'Sign In'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.divider} />
                    </View>

                    {/* Social Login Buttons */}
                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-google" size={24} color="#DB4437" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-apple" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default loginSignup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
        marginTop: 40,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
    },
    formContainer: {
        marginBottom: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        height: 50,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#4F46E5',
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: '#4F46E5',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleText: {
        fontSize: 14,
        color: '#6B7280',
    },
    toggleLink: {
        fontSize: 14,
        color: '#4F46E5',
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    imagePickerContainer: {
        alignSelf: 'center',
        marginBottom: 24,
        position: 'relative',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#4F46E5',
    },
    imagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    imagePlaceholderText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 8,
        textAlign: 'center',
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
});