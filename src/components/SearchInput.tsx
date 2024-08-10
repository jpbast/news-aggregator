import { useRef } from "react";
import Button from "./Button";
import { IoSearch } from "react-icons/io5";

type SearchInputProps = {
  onSubmit: (value: string) => void;
};

const SearchInput: React.FC<SearchInputProps> = ({ onSubmit }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex flex-col gap-1 w-full">
        <label className="font-semibold">Search by keyword</label>
        <div className="relative">
          <input
            ref={inputRef}
            className="shadow-md w-full rounded-xl py-2 px-3 border-none outline-none"
            placeholder="E.g.: Bitcoin"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && inputRef.current?.value) {
                e.preventDefault();
                onSubmit(inputRef.current?.value);
              }
            }}
          />
          <Button
            className="absolute top-1 bottom-1 right-1 rounded-lg"
            label="Search"
            icon={<IoSearch size={20} />}
            onClick={() => {
              const value = inputRef.current?.value;

              if (value) {
                onSubmit(value);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
