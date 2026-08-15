'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import handleMe from './model/handleMe';
import { setUser,clearUser,setAuthLoading } from './model/authSlice';

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await handleMe();

                dispatch(setUser(user));
            } catch {
                dispatch(clearUser());
            } finally {
                dispatch(setAuthLoading(false));
            }
        };

        checkAuth();
    }, [dispatch]);

    return children;
}