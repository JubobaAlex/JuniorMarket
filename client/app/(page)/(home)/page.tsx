import ProductFeed from '@/widgets/product-feed/ui/ProductFeed';
import ProductSearch from '../../../features/product-search/ui/ProductSearch';
import Header from '@/widgets/header/ui/Header';
export default function Home() {
  return (
   <div>
      <Header />
      <ProductSearch/>
      <ProductFeed/>
   </div>
  );
}
