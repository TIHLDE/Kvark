import { Stack } from "@mui/material";
import { useUserPaymentOrders } from "hooks/User";
import { useMemo } from "react";


const ProfilePaymentOrders = () => {
    const { data, hasNextPage, fetchNextPage, isFetching } = useUserPaymentOrders();
    const paymentOrders = useMemo(() => (data !== undefined ? data.pages.map((page) => page.results).flat(1) : []), [data]);

    console.log(data)

    return (
      <Stack gap={1}>

      </Stack>
    );
  };
  
  export default ProfilePaymentOrders;