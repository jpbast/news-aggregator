import Button from "@/components/Button";
import React from "react";

const Error: React.FC = () => {
  return (
    <div className="w-full h-screen flex flex-col gap-3 items-center justify-center">
      <h1 className="text-2xl font-semibold">Oops! Something went wrong</h1>
      <Button label="Reload page" onClick={() => window.location.reload()} />
    </div>
  );
};

export default Error;
