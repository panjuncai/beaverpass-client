import React from "react";
interface ProductProps{
    title:string;
    price:number;
}
const Product:React.FC<ProductProps>=({
    title,
    price
})=>{
    return (
        <div className="productLayout">
            Product
        </div>
    )
}
export default Product;