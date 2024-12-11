import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.0.240:3333",
  //baseURL: "http://xtbtsbg-anonymous-8081.exp.direct:3333",
  timeout: 5000,
});
