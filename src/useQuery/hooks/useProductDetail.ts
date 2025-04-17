import { useQuery } from "@tanstack/react-query"
import { fetchProductDetail } from "../api/api"

export const useProductDetail = (id: string) => {
  return useQuery({
    queryKey: ["productDetail", id],
    queryFn: () => fetchProductDetail(id),
    enabled: !!id
  })
}
