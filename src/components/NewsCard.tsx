import { News } from "@/types/news";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { IoChevronForwardCircleOutline } from "react-icons/io5";

type NewsCardProps = {
  news: News;
  index: number;
};

const NewsCard: React.FC<NewsCardProps> = ({ news, index }) => {
  const [animate, setAnimate] = useState(false);

  const thumbnail =
    news.thumbnail && news.thumbnail.startsWith("https://")
      ? news.thumbnail
      : "default-news-thumbnail.webp";

  useEffect(() => {
    setAnimate(true);
  }, []);

  console.log("index", index);

  return (
    <div
      className={`rounded-lg shadow-lg flex flex-col gap-3 overflow-hidden bg-gray-100 transition duration-1000 opacity-0 ${
        animate ? "opacity-100" : ""
      }`}
      style={{ transitionDelay: `${index * 0.08}s` }}
    >
      <img src={thumbnail} alt="" className="w-full h-[200px] object-cover" />
      <div className="flex flex-col gap-3 p-2 flex-1">
        <p className="text-sm font-semibold text-gray-500">
          {dayjs(news.publishedAt).format("MMMM DD, YYYY")}
        </p>
        <h2 className="text-lg font-semibold line -clamp-2">{news.title}</h2>
        {/* Guardian API description comes with HTML tags, so let's handle description this way */}
        <div
          className="line-clamp-3 mt-auto"
          dangerouslySetInnerHTML={{ __html: news.description || "" }}
        />
        <a
          href={news.url}
          target="_blank"
          className="flex items-center gap-1 text-lg text-blue-700 hover:opacity-75 transition-all mt-auto"
        >
          <IoChevronForwardCircleOutline size={26} /> Read more
        </a>
      </div>
    </div>
  );
};

export default NewsCard;
