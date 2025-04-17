import { ReactElement } from "react"
import Table from "../components/table/Table"
import SigninPage from "../components/aut/Signin"
import AdminProductPage from "../components/admin/AdminProductPage"
import { Outlet } from "react-router-dom"

function Admin(): ReactElement {
  return (
    <div className="">
      <AdminProductPage />
    </div>
  )
}

export default Admin
