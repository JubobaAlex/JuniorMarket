'use client'

import { useState } from "react"
import '../style/RegisterForm.css'
import handleRegister from "../model/handleRegister"
import handleLogin from "../model/handleLogin"
import { useDispatch } from "react-redux"
import handleMe from "../model/handleMe"
import { setUser } from "../model/authSlice"
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [role, setRole] = useState<'BUYER' | 'SELLER'>('BUYER');
    const [error, setError] = useState<null | string>(null)
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const router = useRouter()

    const onSubmit = async () => {
        setError(null);
        setIsLoading(true);

        try {
            await handleRegister({
                email,
                password,
                role,
            });

            await handleLogin({
                email,
                password,
            });

            const user = await handleMe();

            dispatch(setUser(user));
            router.push('/');
        } catch (err) {
            if (err instanceof Error) {
                let userMessage = err.message;
                if (err.message.includes('email')) {
                    userMessage = 'Пожалуйста, введите корректный email';
                } else if (err.message.includes('password')) {
                    userMessage = 'Пароль должен содержать минимум 6 символов';
                } else if (err.message.includes('already exists')) {
                    userMessage = 'Пользователь с таким email уже существует';
                }
                setError(userMessage);
            } else {
                setError('Произошла неизвестная ошибка. Попробуйте позже.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-register">
            <div className="container-pre">
                {/* Ошибка в фиксированном контейнере без иконки */}
                <div className="error-wrapper">
                    {error && (
                        <div className="error-banner">
                            <span className="error-text">{error}</span>
                            <button 
                                className="error-close-btn" 
                                onClick={() => setError(null)}
                                aria-label="Закрыть ошибку"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>

                <div className="container-text-register">
                    <h2>Регистрация</h2>
                </div>
                
                <div className="container-input-register">
                    <input 
                        className={`register-input ${error ? 'input-error' : ''}`}
                        placeholder="Введите вашу почту"
                        type="email" 
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        disabled={isLoading}
                    />
                    <input 
                        className={`register-input ${error ? 'input-error' : ''}`}
                        placeholder="Введите пароль"
                        type="password" 
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <div className="container-button-register">
                    <div style={{display:'flex', justifyContent:'center'}}>
                        <h2>Выберите кто вы</h2>
                    </div>
                    <div className="role-buttons-container">
                        <button 
                            className={`role-button ${role === 'BUYER' ? 'BUYER' : ''}`} 
                            onClick={() => setRole('BUYER')}
                            disabled={isLoading}
                        >
                            Покупатель
                        </button>
                        <button 
                            className={`role-button ${role === 'SELLER' ? 'SELLER' : ''}`} 
                            onClick={() => setRole('SELLER')}
                            disabled={isLoading}
                        >
                            Продавец
                        </button>
                    </div>
                </div>

                <div className="continue-container">
                    <button 
                        className="continue-button" 
                        onClick={onSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Загрузка...' : 'Продолжить'}
                    </button>
                </div>
            </div>
        </div>
    )
}