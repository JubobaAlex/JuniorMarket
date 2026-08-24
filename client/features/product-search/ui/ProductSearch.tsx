'use client'
import '../style/ProductSearch.css'
export default function ProductSearch() {
    return (
        <div className='container-search'>
            <input className='search-input' placeholder='Поиск товаров' type="text" />
        </div>
    )
}