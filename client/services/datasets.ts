import { api } from "@/lib/api";
export const datasetService = {
  upload: (file: File) => {
    const data = new FormData();
    data.append("file", file);
    return api.post("/datasets/upload", data);
  }
};
