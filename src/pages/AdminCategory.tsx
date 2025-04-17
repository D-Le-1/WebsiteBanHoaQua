import { ReactElement } from "react"
import Table from "../components/table/Table"
import SigninPage from "../components/aut/Signin"
import CategoryPage from "../components/admin/CategoryPage"

function AdminCategory(): ReactElement {
  return (
    <div className="">
      <CategoryPage />
    </div>
  )
}

export default AdminCategory
