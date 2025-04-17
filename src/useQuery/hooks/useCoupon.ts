import { useQuery } from "@tanstack/react-query"
import { getlistCoupon } from "../api/api"

export const useCoupon = () => {
  return useQuery({
    queryKey: ["coupons"],
    queryFn: getlistCoupon
  })
}
