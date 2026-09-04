import API from "../services/api";

export const getAllStaff = () => API.get("/seller/staff");

export const createStaff = (payload) => API.post("/seller/staff", payload);

export const updateStaff = (id, payload) =>
  API.put(`/seller/staff/${id}`, payload);

export const toggleStaffStatus = (id, is_active) =>
  API.patch(
    `/seller/staff/${id}/status`,
    { is_active },
    { meta: { toastError: "Couldn't update staff status" } },
  );

export const deleteStaff = (id) =>
  API.delete(`/seller/staff/${id}`, {
    meta: { toastError: "Couldn't remove the staff member" },
  });
