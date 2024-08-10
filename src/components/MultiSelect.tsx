import { debounce } from "lodash";
import { useState, useRef, memo, useEffect, useCallback } from "react";
import { IoChevronDown } from "react-icons/io5";

type MultiSelectProps = {
  options: {
    label: string;
    value: string;
  }[];
  label: string;
  prompt?: string;
  onChange: (selectedOptions: string[]) => void;
};
const MultiSelect = ({
  options,
  onChange,
  label,
  prompt = "Select one or more options",
}: MultiSelectProps) => {
  const [selectedOptions, setSelectedOptions] = useState(
    [] as { value: string; label: string }[]
  );
  const [opened, setOpened] = useState(false);

  const optionsListRef = useRef<HTMLUListElement | null>(null);
  const containerRef = useRef<HTMLLabelElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as unknown as Node)
      ) {
        setOpened(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;

      const value = e.target.value;
      const option = {
        value,
        label: options.find((opt) => opt.value === e.target.value)?.label || "",
      };

      let newSelectedOptions = selectedOptions;

      if (isChecked) {
        newSelectedOptions = [...selectedOptions, option];
      } else {
        newSelectedOptions = selectedOptions.filter(
          (opt) => opt.value !== value
        );
      }

      setSelectedOptions(newSelectedOptions);

      onChange(newSelectedOptions.map((options) => options.value));
    }, 200),
    [selectedOptions]
  );

  const isClearSelectionEnabled = selectedOptions.length > 0;

  const handleClearSelectionClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const optionsInputs = optionsListRef.current?.querySelectorAll("input");
    (optionsInputs || []).forEach((input) => {
      input.checked = false;
    });

    setSelectedOptions([]);
    onChange([]);
  };

  return (
    <label className="relative flex-1 min-w-[200px]" ref={containerRef}>
      <div className="flex items-center gap-1">
        <span className="font-semibold">{label}</span>
        {selectedOptions.length > 0 && (
          <span className="ml-1 bg-blue-700 text-white size-4 rounded-full flex items-center justify-center text-xs">
            {selectedOptions.length}
          </span>
        )}
      </div>
      <button
        className="cursor-pointer shadow-md rounded-lg px-3 py-2 flex items-center gap-2 w-full flex-1"
        onClick={() => setOpened(!opened)}
      >
        {selectedOptions.length > 0 ? (
          <>
            <p className="line-clamp-1 text-left w-full">
              {selectedOptions.map((opt) => opt.label).join(", ")}
            </p>
          </>
        ) : (
          <p className="text-gray-400">{prompt}</p>
        )}
        <IoChevronDown className="ml-auto" size={20} />
      </button>
      {opened && (
        <div className="absolute bg-white shadow-md pointer-events-auto w-full max-h-60 overflow-y-scroll z-10">
          <button
            onClick={handleClearSelectionClick}
            disabled={!isClearSelectionEnabled}
            className="w-full text-left px-2 py-1 text-blue-600 disabled:opacity-50"
          >
            {"Clear selection"}
          </button>
          <ul ref={optionsListRef}>
            {options.map((option) => {
              return (
                <li key={option.value}>
                  <label
                    className={`flex whitespace-nowrap cursor-pointer px-2 py-1 transition-colors hover:bg-blue-100`}
                  >
                    <input
                      defaultChecked={
                        !!selectedOptions.find(
                          ({ value }) => value === option.value
                        )
                      }
                      type="checkbox"
                      value={option.value}
                      className="cursor-pointer"
                      onChange={handleChange}
                    />
                    <span className="ml-1">{option.label}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </label>
  );
};

export default memo(MultiSelect);
