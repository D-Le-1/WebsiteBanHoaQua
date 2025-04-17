import { listUser } from "../api/api"
import { useQuery } from "@tanstack/react-query"

export const useUser = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: listUser
  })
}
