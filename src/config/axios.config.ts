import axios from "axios";

export default axios.create({
  baseURL: process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL_INTERNAL || "http://localhost:3001",
  withCredentials: true,
});
