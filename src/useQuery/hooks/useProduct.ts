import { useQuery } from "@tanstack/react-query"
import { fetchProducts } from "../api/api"

export const useProduct = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts
  })
}
