import { useQuery } from "@tanstack/react-query"
import { getOrderUser } from "../api/api"

export const useOrderUser = (email: string) => {
  return useQuery({
    queryKey: ["orderusers"],
    queryFn: getOrderUser
  })
}
