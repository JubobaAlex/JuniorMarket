import '../style/CreateProductButton.css'
import Link from 'next/link'

export default function CreateProductButton() {
    return (
        <button className="create-btn" aria-label="Create product">
            <span className="plus-icon"><Link href={'/create'}>+</Link></span>
        </button>
    )
}