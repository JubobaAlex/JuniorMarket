'use client'
import { RootState } from "@/app/store";
import AvatarProfile from "@/shared/avatarProfile/ui/AvatarProfile";
import Link from "next/link"
import { useSelector } from "react-redux"
import "../style/AuthButton.css" 

export default function AuthButton() {
    const jwt = useSelector((state: RootState) => state.auth.jwt)
    
    if (!jwt) {
        return (
            <div className="auth-buttons">
                <Link 
                    href="/login"
                    className="btn-login"
                >
                    Войти
                </Link>

                <Link 
                    href="/register"
                    className="btn-register"
                >
                    Регистрация
                </Link>
            </div>
        );
    }
    
    return (
        <Link href="/profile" className="avatar-link">
            <div>
                <AvatarProfile />
            </div>
        </Link>
    )
}