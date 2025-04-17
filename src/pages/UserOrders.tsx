import { ReactElement } from "react"
import Table from "../components/table/Table"
import SigninPage from "../components/aut/Signin"
import { Order } from "./../useQuery/user/auth"
import OrderPageUser from "./../components/homepage/OrderPageUser"

function UserOrder(): ReactElement {
  return (
    <div className="">
      <OrderPageUser />
    </div>
  )
}

export default UserOrder
