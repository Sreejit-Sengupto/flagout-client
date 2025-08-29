import { useQueryClient } from "@tanstack/react-query";

const useTanstackClient = () => {
    const queryClient = useQueryClient()
    return queryClient;
}

export default useTanstackClient;