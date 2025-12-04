import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { login, signUp } from '../services/authService'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface AuthContextType {
    user: User | null
    role: string | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUpUser: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [role, setRole] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check for persisted user on mount
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user')
                const storedRole = await AsyncStorage.getItem('role')
                if (storedUser && storedRole) {
                    setUser(JSON.parse(storedUser))
                    setRole(storedRole)
                }
            } catch (error) {
                console.error('Error loading user:', error)
            } finally {
                setLoading(false)
            }
        }

        loadUser()

        // Listen to auth state changes
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser)
                // Role should be fetched from Firestore if needed
                const storedRole = await AsyncStorage.getItem('role')
                if (storedRole) {
                    setRole(storedRole)
                }
            } else {
                setUser(null)
                setRole(null)
                await AsyncStorage.removeItem('user')
                await AsyncStorage.removeItem('role')
            }
            setLoading(false)
        })

        return unsubscribe
    }, [])

    const signIn = async (email: string, password: string) => {
        try {
            const { user: loggedInUser, role: userRole } = await login(email, password)
            setUser(loggedInUser)
            setRole(userRole)
            await AsyncStorage.setItem('user', JSON.stringify(loggedInUser))
            await AsyncStorage.setItem('role', userRole)
        } catch (error) {
            throw error
        }
    }

    const signUpUser = async (email: string, password: string) => {
        try {
            const { user: newUser, role: userRole } = await signUp(email, password)
            setUser(newUser)
            setRole(userRole)
            await AsyncStorage.setItem('user', JSON.stringify(newUser))
            await AsyncStorage.setItem('role', userRole)
        } catch (error) {
            throw error
        }
    }

    const signOut = async () => {
        try {
            await auth.signOut()
            setUser(null)
            setRole(null)
            await AsyncStorage.removeItem('user')
            await AsyncStorage.removeItem('role')
        } catch (error) {
            throw error
        }
    }

    return (
        <AuthContext.Provider value={{ user, role, loading, signIn, signUpUser, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export default AuthContext