import axios from "axios";

export const nytAxios = axios.create({
  baseURL: "https://api.nytimes.com/svc/search/v2",
});

export const newsApiAxios = axios.create({
  baseURL: "https://newsapi.org/v2",
});

export const guardianAxios = axios.create({
  baseURL: "https://content.guardianapis.com",
});
