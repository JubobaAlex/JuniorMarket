'use client'

import { useState } from "react"
import '../style/LoginForm.css'
import handleLogin from "../model/handleLogin"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { setUser } from "../model/authSlice"
import handleMe from "../model/handleMe"

export default function LoginForm() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<null | string>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()
    const dispatch = useDispatch();

    const onSubmit = async () => {
        setError(null);
        setIsLoading(true);

        try {
            await handleLogin({
                email,
                password,
            });

            const user = await handleMe();

            dispatch(setUser(user));
            router.push('/');
        } catch (err) {
            let errorMessage = 'Произошла ошибка при входе';
            
            if (err instanceof Error) {
                if (err.message.includes('401') || err.message.includes('Unauthorized') || err.message.includes('Invalid credentials')) {
                    errorMessage = 'Неверный email или пароль';
                } else if (err.message.includes('email')) {
                    errorMessage = 'Пожалуйста, введите корректный email';
                } else if (err.message.includes('password')) {
                    errorMessage = 'Пароль должен содержать минимум 6 символов';
                } else {
                    errorMessage = err.message;
                }
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-login">
            <div className="container-pre-login">
                {/* Ошибка в фиксированном контейнере */}
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

                <div className="container-text-login">
                    <h2>Вход</h2>
                </div>

                <div className="container-input-login">
                    <input
                        className={`login-input ${error ? 'input-error' : ''}`}
                        placeholder="Введите вашу почту"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        disabled={isLoading}
                    />

                    <input
                        className={`login-input ${error ? 'input-error' : ''}`}
                        placeholder="Введите пароль"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        disabled={isLoading}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !isLoading) {
                                onSubmit();
                            }
                        }}
                    />
                </div>
                <div className="login-continue-container">
                    <button
                        className="login-continue-button"
                        onClick={onSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                </div>
            </div>
        </div>
    );
}