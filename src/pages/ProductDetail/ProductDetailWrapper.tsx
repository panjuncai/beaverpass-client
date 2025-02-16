import React from 'react';
import {useParams} from 'react-router-dom'
import ProductDetail from './ProductDetail'

const ProductDetailWrapper:React.FC=()=>{
    const {productId}=useParams<{productId:string}>();
    if(!productId){
        return <div>Error: Product ID is missing.</div>
    }

    return <ProductDetail productId={productId} />
}
export default ProductDetailWrapper;