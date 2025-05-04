import { ReactElement } from "react"
import Table from "../components/table/Table"
import Header from "../components/header/header"
import Footer from "../components/footer/Footer"
import ProductList from "../components/homepage/productPage"


function ProductPage(): ReactElement {
  return (
    <div className="">
        <ProductList />
    </div>
  )
}
export default ProductPage
