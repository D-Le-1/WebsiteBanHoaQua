import { useQuery } from "@tanstack/react-query"
import { getProductByCategory } from "../api/api"

export const useProductwithCate = ({ categoryName }) => {
  return useQuery({
    queryKey: ["productsCategory", categoryName],
    queryFn: () => getProductByCategory({ categoryName })
  })
}