import AuthButton from '@/widgets/auth-button/ui/AuthButton'
import Logo from '@/shared/logo/ui/Logo'
import '@/widgets/header/style/Header.css'
import Link from 'next/link'
import CreateProductButton from '@/features/create-product/ui/CreateProductButton'
import UserAction from '@/features/user-actions/ui/UserAction'
export default function Header() {
    return (
        <header>
            <div style={{margin:'10px'}}>
                <Link href={'/'}><Logo /></Link>
            </div>   
            <div style={{margin:'10px'}}>
                <UserAction />
            </div>
        </header>
    )
}