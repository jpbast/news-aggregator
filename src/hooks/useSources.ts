import { NewsApiSourcesResponse } from "@/types/newsApi";
import { Source } from "@/types/source";
import { newsApiAxios } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

const getSources = async () => {
  const { data } = await newsApiAxios.get<NewsApiSourcesResponse>(
    `/top-headlines/sources?apiKey=${import.meta.env.VITE_NEWS_API_KEY}`
  );

  return data;
};

export default function useSources() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sources"],
    queryFn: getSources,
  });

  const parsedData: Source[] = data?.sources
    ? [
        ...data.sources,
        { id: "nyt", name: "The New York Times" },
        { id: "guardian", name: "The Guardian" },
      ]
    : [];

  return {
    data: parsedData.sort((a, b) => a.name.localeCompare(b.name)),
    isLoading,
    error,
  };
}
