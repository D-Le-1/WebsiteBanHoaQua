import { useQuery } from "@tanstack/react-query";
import { fetchReviews } from "../api/api";

export const useGetListReview = (productId) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => fetchReviews({ productId }),
    enabled: !!productId,
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false,
  });
};
  
