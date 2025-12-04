import Button from '@/components/Button'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {
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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                    <TouchableOpacity
                        style={styles.settingsButton}
                        onPress={() => { }}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="settings-outline" size={24} color="#4F46E5" />
                    </TouchableOpacity>
                </View>
                <View style={styles.loginSignupContainer}>
                    <Button text="Signup" onPress={() => { }} backgroundColor='#4F46E5' textColor='white' />
                    <Button text="Login" onPress={() => { }} />
                </View>

                {/* Menu Options */}
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

                {/* Logout Button */}
                <View style={styles.logoutContainer}>
                    <Button
                        text="Logout"
                        onPress={() => { }}
                        backgroundColor='#EF4444'
                        textColor='white'
                        borderColor='#EF4444'
                    />
                </View>
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
    settingsButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
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
})