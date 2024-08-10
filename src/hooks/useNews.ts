import { GuardianApiResponse } from "@/types/guardianApi";
import useNewsByApiSource from "./useNewsByApiSource";
import { Filter } from "@/types/filters";
import { NewsApiResponse } from "@/types/newsApi";
import { NYTApiResponse } from "@/types/nytApi";
import { useEffect, useMemo } from "react";
import { News } from "@/types/news";
import dayjs from "dayjs";

type Args = {
  filters: Filter;
  inView: boolean;
};

export default function useNews({ filters, inView }: Args) {
  const {
    data: newsApiData,
    isLoading: newsApiLoading,
    hasNextPage: newsApiHasNextPage,
    isFetchingNextPage: newsApiIsFetchingNextPage,
    fetchNextPage: newsApiFetchNextPage,
  } = useNewsByApiSource<NewsApiResponse>({
    apiSource: "NewsAPI",
    filters,
  });
  const {
    data: guardianData,
    isLoading: guardianLoading,
    hasNextPage: guardianHasNextPage,
    isFetchingNextPage: guardianIsFetchingNextPage,
    fetchNextPage: guardianFetchNextPage,
  } = useNewsByApiSource<GuardianApiResponse>({
    apiSource: "Guardian",
    filters,
  });
  const {
    data: nytData,
    isLoading: nytLoading,
    hasNextPage: nytHasNextPage,
    isFetchingNextPage: nytIsFetchingNextPage,
    fetchNextPage: nytFetchNextPage,
  } = useNewsByApiSource<NYTApiResponse>({
    apiSource: "NYT",
    filters,
  });

  const news = useMemo(() => {
    const arr = [] as News[][];

    if (newsApiData && newsApiData.pages[0] !== null) {
      const newsApi = newsApiData.pages.map((data) =>
        data.articles.map(
          (article, idx) =>
            ({
              id: `${idx}-${article.title}`,
              apiSource: "NewsAPI",
              publishedAt: article.publishedAt,
              title: article.title,
              description: article.description,
              url: article.url,
              thumbnail: article.urlToImage,
              categoryId: article.source?.id,
              categoryName: article.source?.name,
            } as News)
        )
      );
      arr.push([...newsApi.flat()]);
    }

    if (guardianData && guardianData.pages[0] !== null) {
      const guardian = guardianData.pages.map((data) =>
        data.response.results.map(
          (res) =>
            ({
              id: res.id,
              apiSource: "Guardian",
              publishedAt: res.webPublicationDate,
              title: res.webTitle,
              url: res.webUrl,
              thumbnail: res.fields?.thumbnail,
              description: res.fields?.trailText,
              categoryId: res.sectionId,
              categoryName: res.sectionName,
            } as News)
        )
      );
      arr.push([...guardian.flat()]);
    }

    if (nytData && nytData.pages[0] !== null) {
      const nyt = nytData.pages.map((data) =>
        data.response.docs.map((doc) => {
          const thumbnail = doc.multimedia.find(
            (media) => media.subType === "articleLarge"
          );

          const img = thumbnail?.url || doc.multimedia?.[0]?.url;

          return {
            id: doc._id,
            apiSource: "NYT",
            publishedAt: doc.pub_date,
            title: doc.headline.main,
            url: doc.web_url,
            thumbnail: img ? `https://static01.nyt.com/${img}` : undefined,
            categoryId: doc.news_desk,
            categoryName: doc.news_desk,
            description: doc.lead_paragraph,
          } as News;
        })
      );
      arr.push([...nyt.flat()]);
    }

    return arr.flat();
  }, [newsApiData, nytData, guardianData]);

  useEffect(() => {
    if (!inView) {
      return;
    }

    if (newsApiHasNextPage) {
      newsApiFetchNextPage();
    }
    if (guardianHasNextPage) {
      guardianFetchNextPage();
    }
    if (nytHasNextPage) {
      nytFetchNextPage();
    }
  }, [inView, newsApiHasNextPage, guardianHasNextPage, nytHasNextPage]);

  const isLoading = newsApiLoading || guardianLoading || nytLoading;
  const isFetchingNextPage =
    newsApiIsFetchingNextPage ||
    guardianIsFetchingNextPage ||
    nytIsFetchingNextPage;

  // News API does not have a filter by category query, so let's filter it manually down below
  return {
    data: news.filter((n) =>
      n.apiSource === "NewsAPI" &&
      filters?.categories &&
      filters.categories.length > 0
        ? !!filters.categories.find((c) => c === n.categoryId)
        : true &&
          // Some wrong articles were being displayed after cleaning up some filters, so let's ensure just the right ones will be shown
          dayjs(n.publishedAt).isAfter(filters.dates.from) &&
          dayjs(n.publishedAt).isBefore(filters.dates.to)
    ),
    isLoading,
    isFetchingNextPage,
  };
}
