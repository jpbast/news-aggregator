import React from "react";

const NewsSkeleton: React.FC = () => {
  return (
    <>
      {Array(30)
        .fill("")
        .map((_, index) => (
          <div
            key={index}
            role="status"
            className="animate-pulse"
            style={{ height: 400 }}
          >
            <div
              className="bg-gray-300 rounded-lg dark:bg-gray-500 mx-auto"
              style={{ height: 400 }}
            />
          </div>
        ))}
    </>
  );
};

export default NewsSkeleton;
