import AuthButton from '@/widgets/auth-button/ui/AuthButton'
import Logo from '@/shared/logo/ui/Logo'
import '@/widgets/header/style/Header.css'
import Link from 'next/link'
export default function Header() {
    return (
        <header>
            <div style={{margin:'10px'}}>
                <Link href={'/'}><Logo /></Link>
            </div>   
            <div>
                <AuthButton />
            </div>
        </header>
    )
}