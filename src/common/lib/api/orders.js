import apiClientRequest from "@/common/lib/api";
import localStorage from "@/common/lib/local-storage";

export async function fetchPaymentHistories(searchQuery) {
  const {
    data: {
      data
    }
  } = await apiClientRequest.get(`/orders/list/${localStorage.getAddress()}`, {
    params: {
      size: 1000,
      page: 1,
      keyword: searchQuery || ""
    }
  });

  return data;
}

export async function fetchPaymentDetails(hash) {
  const {
    data
  } = await apiClientRequest.get(
    `/orders/${hash}`
  );

  return data;
}

export async function fetchBountyLists(hash) {
  const { data: { data } } = await apiClientRequest.get(
    `/orders/bounty_list/${hash}`
  );

  return data;
}
