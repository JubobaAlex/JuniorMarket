'use client'

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/app/store";
import '../style/ProfileFeed.css'
import { useRouter } from 'next/navigation'
import { handleLogout } from "@/features/auth/model/handleLogout";
import { clearUser } from "@/features/auth/model/authSlice";

export default function ProfileFeed() {
    const router = useRouter()
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.auth.user);
    
    async function handleLogoutFun() {
        try {
            await handleLogout(dispatch);
            router.push('/');
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    }



    if (!user) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '30px' }}>
                <div className="error-message">Зарегистрируйтесь</div>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '30px' }}>
            <div className="container-profile">
                <span>Данные пользователя</span>
                <div className="container-profile-information">
                    <span>Почта: {user?.email}</span>
                    <span>Зарегистрирован как: {user?.role === 'BUYER' ? 'покупатель' : 'продавец'}</span> 
                </div> 
                <div className="container-exit-profile">
                    <button onClick={handleLogoutFun}>Выйти</button>
                </div>
            </div>
        </div>
    )
}