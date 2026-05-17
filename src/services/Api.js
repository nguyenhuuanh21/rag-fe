import { Http } from "./Http";
export const chatUser=(data)=>Http.post("chat-hybrid",data);