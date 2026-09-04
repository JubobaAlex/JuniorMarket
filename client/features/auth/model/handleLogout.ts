'use client';

import { clearUser, setAuthLoading } from './authSlice';
import { AppDispatch } from '@/app/store';

export async function handleLogout(
    dispatch: AppDispatch,
): Promise<void> {
    try {
        dispatch(setAuthLoading(true));

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
            {
                method: 'POST',
                credentials: 'include',
            },
        );

        if (!response.ok) {
            const error = await response.json();

            throw new Error(
                error.message || 'Ошибка выхода из аккаунта',
            );
        }

        dispatch(clearUser());
    } finally {
        dispatch(setAuthLoading(false));
    }
}
