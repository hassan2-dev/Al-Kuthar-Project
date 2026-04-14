import api from "./axiosInstance";

export const createContract = async (payload) => {
  const { data } = await api.post("/contracts", payload);
  return data;
};

export const listContracts = async (params = {}) => {
  const { data } = await api.get("/contracts", { params });
  return data;
};

export const getContractById = async (id) => {
  const { data } = await api.get(`/contracts/${id}`);
  return data;
};

export const updateContract = async (id, payload) => {
  const { data } = await api.put(`/contracts/${id}`, payload);
  return data;
};

export const confirmContract = async (id) => {
  const { data } = await api.put(`/contracts/${id}/confirm`);
  return data;
};

export const revertContract = async (id) => {
  const { data } = await api.put(`/contracts/${id}/revert`);
  return data;
};

export const archiveContract = async (id) => {
  const { data } = await api.put(`/contracts/${id}/archive`);
  return data;
};

export const unarchiveContract = async (id) => {
  const { data } = await api.delete(`/contracts/${id}/archive`);
  return data;
};

export const deleteContract = async (id) => {
  const { data } = await api.delete(`/contracts/${id}`);
  return data;
};

export const getContractLogs = async (id) => {
  const { data } = await api.get(`/contracts/${id}/logs`);
  return data;
};
