import { useState } from "react";
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

  const [ref, inView] = useInView({ triggerOnce: false });

  const { data: news, isLoading } = useNews({ filters, inView });

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
                <NewsCard key={n.id} news={n} index={index} />
              ))}
              <div ref={ref} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
