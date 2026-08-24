'use client'
import AuthButton from "@/widgets/auth-button/ui/AuthButton";
import CreateProductButton from "../../create-product/ui/CreateProductButton";
import CartButton from "@/features/cart/ui/CartButton";
import '../style/UserAction.css'
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

export default function UserAction() {
    const user = useSelector(
        (state: RootState) => state.auth.user
    );
    
    return ( 
        <div className="container-user-action">
            <AuthButton />
            {user && (
                <>
                    {user.role === 'SELLER' && <CreateProductButton />}
                    {user.role === 'BUYER' && <CartButton />}
                </>
            )}
        </div>
    );
}