import { ApiSource } from "./apiSource";

export type News = {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  apiSource: ApiSource;
  categoryName?: string;
  categoryId?: string;
  description?: string;
  thumbnail?: string;
};
