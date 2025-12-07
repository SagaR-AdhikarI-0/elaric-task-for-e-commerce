import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { login as loginService, signUp as signUpService } from "../services/authService";

interface AuthContextType {
    user: User | null;
    role: string | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name?: string, profileImageUrl?: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log("User data :", firebaseUser);
            setUser(firebaseUser);
            console.log("FirebaseUser adfasfsasdfa sf", firebaseUser);

            if (firebaseUser) {
                //  role from Firestore when user logs in
                try {
                    const { getUserRole } = await import("../services/authService");
                    const userRole = await getUserRole(firebaseUser.uid);
                    setRole(userRole);
                } catch (error) {
                    console.error("Error fetching user role:", error);
                    setRole("user");
                }
            } else {
                setRole(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            setLoading(true);
            const { user: authUser, role: userRole } = await loginService(email, password);
            setUser(authUser);
            setRole(userRole);
        } catch (error: any) {
            console.error("Sign in error:", error);
            throw new Error(error.message || "Failed to sign in");
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string, name?: string, profileImageUrl?: string) => {
        try {
            setLoading(true);
            const { user: authUser, role: userRole } = await signUpService(email, password, name, profileImageUrl);
            setUser(authUser);
            setRole(userRole);
        } catch (error: any) {
            console.error("Sign up error:", error);
            throw new Error(error.message || "Failed to sign up");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setRole(null);
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, signIn, signUp, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
