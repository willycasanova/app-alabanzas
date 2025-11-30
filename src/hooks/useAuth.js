import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/services/firebase.js';

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                setUser(authUser);
                const userProfileDocRef = doc(db, `artifacts/${appId}/users/${authUser.uid}/profile/user_data`);
                try {
                    const docSnap = await getDoc(userProfileDocRef);
                    setIsAdmin(docSnap.exists() && docSnap.data().role === 'admin');
                } catch (e) {
                    console.error("Error checking admin role:", e);
                    setIsAdmin(false);
                }
            } else {
                setUser(null);
                setIsAdmin(false);
            }
            setIsAuthReady(true);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (e) {
            setError(e);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (e) {
            setError(e);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        setError(null);
        try {
            await signOut(auth);
        } catch (e) {
            setError(e);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (email) => {
        setLoading(true);
        setError(null);
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (e) {
            setError(e);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    return { user, isAdmin, isAuthReady, loading, error, login, register, logout, resetPassword };
};