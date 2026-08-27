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
    const dispatch = useDispatch()
    const router = useRouter()

    const onSubmit = async () => {
        setError(null);

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
                setError(err.message);
            } else {
                setError('Произошла ошибка');
            }
        }
    };

    return (
        <div className="container-register">
            <div className="container-pre">
                <div className="container-text-register">
                    <h2>Регистрация</h2>
                </div>
                
                <div className="container-input-register">
                    <input 
                        className="register-input"
                        placeholder="Введите вашу почту"
                        type="email" 
                        value={email}
                        onChange={(event) => setEmail(event.target.value)} 
                    />
                    <input 
                        className="register-input" 
                        placeholder="Введите пароль"
                        type="password" 
                        value={password}
                        onChange={(event) => setPassword(event.target.value)} 
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
                        >
                            Покупатель
                        </button>
                        <button 
                            className={`role-button ${role === 'SELLER' ? 'SELLER' : ''}`} 
                            onClick={() => setRole('SELLER')}
                        >
                            Продавец
                        </button>
                    </div>
                </div>

                <div className="continue-container">
                    <button className="continue-button" onClick={onSubmit}>
                        Продолжить
                    </button>
                </div>
            </div>
        </div>
    )
}