
import '../style/Logo.css'
import Image from 'next/image'

export default function Logo(){
    return (
        <div className="container-Logo">
            <Image 
                src={'/img/logo.png'}
                alt='Логотип'
                width={50}  
                height={50}   
            />
            <h2>JuniorMarket</h2>
        </div>
    )
}