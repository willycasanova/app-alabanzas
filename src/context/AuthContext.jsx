import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../services/firebase.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                setUser(authUser);
                const userDocRef = doc(db, 'users', authUser.uid);
                // Aquí deberías usar getDoc, pero vamos a asumir que el rol se guarda en el documento 'users/{uid}'
                const userDoc = await getDoc(userDocRef);
                setIsAdmin(userDoc.exists() && userDoc.data()?.role === 'admin');
            } else {
                setUser(null);
                setIsAdmin(false);
            }
            setIsAuthReady(true);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
    };

    const value = {
        user,
        isAuthReady,
        isAdmin,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
