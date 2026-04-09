import api from "./axiosInstance";

export const uploadDocument = async (file, options = {}) => {
  const formData = new FormData();
  formData.append("file", file);

  if (options.contractId) {
    formData.append("contractId", String(options.contractId));
  }

  const { data } = await api.post("/documents/upload", formData, {
    params: options.contractId ? { contractId: options.contractId } : undefined,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const listDocuments = async (params = {}) => {
  const { data } = await api.get("/documents", { params });
  return data;
};

export const getDocumentDownloadUrl = async (id) => {
  const { data } = await api.get(`/documents/${id}/download`);
  return data;
};
