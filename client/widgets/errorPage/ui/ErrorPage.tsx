import '../style/ErrorPage.css'
import Link from 'next/link'

interface ErrorPageProps  {
    title:string
}

export default function ErrorPage({title}:ErrorPageProps) {
    return (
        <div className="container-error-page">
            <span>Страница недоступна, {title}</span>
            <Link href={'/'}>Выйти</Link> 
        </div>
    )
}