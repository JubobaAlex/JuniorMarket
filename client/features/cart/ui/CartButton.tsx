import Link from 'next/link'
import '../style/CartButton.css'
export default function CartButton() {
    return (
        <Link href={'/cart'} className="container-cart">
            <img src="/img/cart.png" alt="корзина" />
        </Link>
    )
}