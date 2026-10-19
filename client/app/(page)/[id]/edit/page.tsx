import EditProductForm from "@/features/edit-product/ui/EditProductForm";
import Header from "@/widgets/header/ui/Header";

export default async function Edit({ params }: { params: { id: string } }) {
       const { id } = await params;
    return (
       <div>
            <Header />
            <EditProductForm productId={Number(id)} />
       </div>
    )
}