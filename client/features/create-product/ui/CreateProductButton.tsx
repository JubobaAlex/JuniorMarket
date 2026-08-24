'use client'
import '../style/CreateProductButton.css'

export default function CreateProductButton() {
    return (
        <button className="create-btn" aria-label="Create product">
            <span className="plus-icon">+</span>
        </button>
    )
}