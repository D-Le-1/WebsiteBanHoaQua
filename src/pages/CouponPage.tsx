import { ReactElement } from "react"
import Table from "../components/table/Table"
import SigninPage from "../components/aut/Signin"
import CouponPage from "../components/admin/Coupon"

function Coupon(): ReactElement {
  return (
    <div className="">
        <CouponPage/>
    </div>
  )
}

export default Coupon