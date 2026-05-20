import Http  from "./Http";
export const chatUser = (data) => Http.post("chat", data);
export const getChatHistory = () => Http.get("get-chat-history");
export const logout= () => Http.post("logout");
export const login = (data) => Http.post("login", data);
export const register = (data) => Http.post("register", data);
export const refreshToken = () => Http.post("refresh-token");
export const clearChatHistory = () => Http.delete("clear-chat-history");

