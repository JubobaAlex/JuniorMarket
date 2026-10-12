'use client'

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import '../style/ProfileFeed.css';
import { useRouter } from 'next/navigation';
import { handleLogout } from "@/features/auth/model/handleLogout";
import { clearUser } from "@/features/auth/model/authSlice";
import hadleDelete from "@/features/auth/model/handleDelete";
import Modal from "@/shared/Modal/ui/Modal";
import Link from "next/link";

export default function ProfileFeed() {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);

    const [isDeleting, setIsDeleting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');

    async function handleLogoutFun() {
        try {
            await handleLogout(dispatch);
            router.push('/');
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    }

    function handleDeleteAccount() {
        setError('');
        setIsModalOpen(true);
    }

    async function confirmDeleteAccount() {
        setIsDeleting(true);
        setError('');

        try {
            await hadleDelete();

            dispatch(clearUser());
            setIsModalOpen(false);

            router.push('/');
            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Произошла ошибка при удалении аккаунта'
            );
        } finally {
            setIsDeleting(false);
        }
    }

    if (!user) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '30px' }}>
                <div className="error-message">Зарегистрируйтесь</div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '30px' }}>
            <div className="container-profile">
                <span>Данные пользователя</span>

                <div className="container-profile-information">
                    <span>Почта: {user.email}</span>
                    <span>
                        Зарегистрирован как: {user.role === 'BUYER' ? 'покупатель' : 'продавец'}
                    </span>
                </div>

                <div className="action-profile-button">
                    <div className="container-personal-account">
                        <button>
                            <Link
                            href={'/personalAccount'}
                                >
                                    Мои товары
                            </Link>
                        </button>
                    </div>
                    
                    <div className="container-exit-profile">
                        <button onClick={handleLogoutFun}>Выйти</button>
                    </div>

                <div className="container-delete-profile">
                        <button
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                        >
                            Удалить аккаунт
                        </button>
                    </div>
                </div>

                {isModalOpen && (
                    <Modal
                        title="Удаление аккаунта"
                        description="Вы уверены, что хотите удалить аккаунт? Это действие может быть необратимым."
                        confirmText="Удалить аккаунт"
                        cancelText="Отмена"
                        isLoading={isDeleting}
                        onConfirm={confirmDeleteAccount}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}
