import { Filter } from "@/types/filters";
import { ApiSource } from "@/types/apiSource";
import { guardianAxios, newsApiAxios, nytAxios } from "@/utils/axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { NYTApiResponse } from "@/types/nytApi";
import { GuardianApiResponse } from "@/types/guardianApi";
import { NewsApiResponse } from "@/types/newsApi";
import dayjs from "dayjs";

const PAGE_SIZE = 10;
const PAGINATION_LIMIT = 8;

function getFetchFuncBySource<T>(
  apiSource: ApiSource,
  filters?: Filter
): ({ pageParam }: { pageParam: number }) => Promise<T> {
  return async ({ pageParam }: { pageParam: number }) => {
    const keyword = filters?.keyword;
    const keywordFilter = `&q=${keyword || "bitcoin"}`;
    const hasSourceFilter = (filters?.sourceIds || []).length > 0;

    const fromDate = filters?.dates.from.toISOString();
    const toDate = filters?.dates.to.toISOString();

    if (apiSource === "Guardian") {
      const hasGuardianSource = hasSourceFilter
        ? filters?.sourceIds?.find((id) => id === "guardian")
        : true;
      if (hasGuardianSource) {
        const categoriesFilter =
          (filters?.categories || []).length > 0
            ? filters?.categories?.join("|")
            : null;

        const { data } = await guardianAxios.get<T>(
          `/search?api-key=${
            import.meta.env.VITE_GUARDIAN_API_KEY
          }&show-fields=thumbnail,body,trailText&page=${
            pageParam === 0 ? pageParam + 1 : pageParam
          }${
            categoriesFilter ? `&section=${categoriesFilter}` : ""
          }${keywordFilter}&from-date=${dayjs(fromDate).format(
            "YYYY-MM-DD"
          )}&to-date=${dayjs(toDate).format("YYYY-MM-DD")}`
        );

        return data;
      } else {
        return null as T;
      }
    }

    if (apiSource === "NYT") {
      const hasNytSource = hasSourceFilter
        ? filters?.sourceIds?.find((id) => id === "nyt")
        : true;

      if (hasNytSource) {
        const categoriesFilter =
          (filters?.categories || []).length > 0
            ? filters?.categories?.map((cat) => `"${cat}"`).join(" OR ")
            : null;

        const { data } = await nytAxios.get<T>(
          `/articlesearch.json?api-key=${
            import.meta.env.VITE_NYT_API_KEY
          }&page=${pageParam}${keywordFilter}${
            categoriesFilter ? `&fq=news_desk:(${categoriesFilter})` : ""
          }&begin_date=${dayjs(fromDate).format("YYYYMMDD")}&end_date=${dayjs(
            toDate
          ).format("YYYYMMDD")}`
        );
        return data;
      } else {
        return null as T;
      }
    }

    const sources = hasSourceFilter
      ? filters?.sourceIds?.filter((id) => id !== "nyt" && id !== "guardian")
      : false;

    const { data } = await newsApiAxios.get<T>(
      `/everything?apiKey=${
        import.meta.env.VITE_NEWS_API_KEY
      }${keywordFilter}&page=${
        pageParam === 0 ? pageParam + 1 : pageParam
      }&pageSize=${PAGE_SIZE}${
        sources && sources.length > 0 ? `&sources=${sources.join(",")}` : ""
      }${`&from=${fromDate}&to=${toDate}`}`
    );

    return data;
  };
}

type Args = {
  apiSource: ApiSource;
  filters?: Filter;
};

export default function useNewsByApiSource<T>({ apiSource, filters }: Args) {
  const fetchFunc = getFetchFuncBySource<T>(apiSource, filters);

  const data = useInfiniteQuery<T>({
    queryFn: (args) => fetchFunc({ pageParam: args.pageParam as number }),
    queryKey: [
      apiSource,
      filters?.keyword,
      filters?.sourceIds,
      filters?.categories,
      filters?.dates,
    ],
    initialPageParam: 0,
    staleTime: Infinity,
    getNextPageParam: (lastPage, allPages) => {
      // Let's restrict the pagination limit in order to avoid any errors related to the API's testing account. Testing accounts sets pagination limits and it is different accordingly to the API
      if (allPages.length >= PAGINATION_LIMIT) {
        return undefined;
      }

      if (apiSource === "Guardian") {
        const guardianData = lastPage as GuardianApiResponse;
        return guardianData?.response?.results?.length &&
          guardianData?.response.pages > allPages.length + 1
          ? allPages.length + 1
          : undefined;
      }

      if (apiSource === "NYT") {
        const nytData = lastPage as NYTApiResponse;
        return nytData?.response?.docs?.length
          ? allPages.length + 1
          : undefined;
      }

      const newsApiData = lastPage as NewsApiResponse;
      return newsApiData.articles.length ? allPages.length + 1 : undefined;
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return { ...data };
}
