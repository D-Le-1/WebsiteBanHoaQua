import { ReactElement } from "react"
import Table from "../components/table/Table"
import SigninPage from "../components/aut/Signin"
import UserPage from "../components/admin/UserPage"
import Admin from "./Admin"

function AdminUser(): ReactElement {
  return (
    <div className="">
      <UserPage />
    </div>
  )
}

export default AdminUser
