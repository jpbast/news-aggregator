import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Filter } from "@/types/filters";
import NewsCard from "@/components/NewsCard";
import dayjs from "dayjs";
import useNews from "@/hooks/useNews";
import Filters from "@/components/Filters";
import NewsSkeleton from "@/components/NewsSkeleton";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const Home: React.FC = () => {
  const [filters, setFilters] = useState({
    keyword: "bitcoin",
    dates: {
      from: dayjs().subtract(1, "month").toDate(),
      to: new Date(),
    },
  } as Filter);

  const animation = useRef(true);

  const [ref, inView] = useInView({ triggerOnce: false });

  const {
    data: news,
    isLoading,
    isFetchingNextPage,
  } = useNews({ filters, inView });

  useEffect(() => {
    // Disable opacity animation for articles coming after infinite scrolling
    if (isLoading) {
      animation.current = true;
    }

    if (isFetchingNextPage) {
      animation.current = false;
    }
  }, [isFetchingNextPage, isLoading]);

  return (
    <div className="flex flex-col gap-4 relative">
      <ScrollToTopButton />
      <Filters filters={filters} setFilters={setFilters} />
      {!isLoading && news.length === 0 ? (
        <p className="text-center text-xl font-semibold w-full mt-5">
          Oops! No articles found with current filters
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-10 max-[400px]:grid-cols-1 mt-5">
          {isLoading ? (
            <NewsSkeleton />
          ) : (
            <>
              {news.map((n, index) => (
                <>
                  <div ref={index === news.length - 5 ? ref : undefined}>
                    <NewsCard
                      key={n.id}
                      news={n}
                      index={index}
                      animation={animation.current}
                    />
                  </div>
                </>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
