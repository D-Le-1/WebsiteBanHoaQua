import { useQuery } from "@tanstack/react-query";
import { getOrderDetail } from "../api/api";

export const useGetOrderDetails = (id) => {
    return useQuery({
        queryKey: ["orderDetail", id],
        queryFn: () => getOrderDetail({id})
    });
};
