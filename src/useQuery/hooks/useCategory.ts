import { listCategory } from "../api/api"
import { useQuery } from "@tanstack/react-query"

export const useCategory = () => {
  return useQuery({
    queryKey: ["category"],
    queryFn: listCategory
  })
}
