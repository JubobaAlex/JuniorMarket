'use client';
import { clearUser, setAuthLoading } from "./authSlice";
import { AppDispatch } from "@/app/store";
import { useRouter } from 'next/navigation';

export async function handleLogout(
    dispatch: AppDispatch,
    router?: ReturnType<typeof useRouter>
): Promise<void> {
    try {
        dispatch(setAuthLoading(true));

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Ошибка выхода из аккаунта');
        }

        dispatch(clearUser());
        dispatch(setAuthLoading(false));
        if (router) {
            router.push('/');
            router.refresh();
        } else {
            // Fallback
            window.location.href = '/';
        }

    } catch (error) {
        dispatch(setAuthLoading(false));
        console.error('Logout error:', error);
        throw error;
    }
}