import React from "react";
import { Filter } from "@/types/filters";
import SearchInput from "./SearchInput";
import useSources from "@/hooks/useSources";
import useCategories from "@/hooks/useCategories";
import MultiSelect from "./MultiSelect";
import DateInput from "./DateInput";
import dayjs from "dayjs";

type FiltersProps = {
  filters: Filter;
  setFilters: (filters: Filter) => void;
};

const Filters: React.FC<FiltersProps> = ({ filters, setFilters }) => {
  const { data: sources } = useSources();
  const { data: categories } = useCategories();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 max-[668px]:flex-col">
        <div className="w-full flex-1">
          <SearchInput
            onSubmit={(keyword) => setFilters({ ...filters, keyword })}
          />
        </div>
        <div className="flex gap-3 items-center flex-wrap max-[668px]:w-full">
          <div className="flex-1">
            <DateInput
              // News API free account does not return any article older than 1 months
              minDate={dayjs().subtract(1, "months").toDate()}
              maxDate={filters.dates.to}
              label="Start date"
              selectedDate={filters.dates.from}
              onChange={(date) =>
                setFilters({
                  ...filters,
                  dates: {
                    ...filters.dates,
                    from: dayjs(date as Date)
                      .set("hours", 0)
                      .set("minutes", 0)
                      .toDate(),
                  },
                })
              }
            />
          </div>
          <div className="flex-1">
            <DateInput
              maxDate={new Date()}
              minDate={filters.dates.from}
              label="End date"
              selectedDate={filters.dates.to}
              onChange={(date) =>
                setFilters({
                  ...filters,
                  dates: {
                    ...filters.dates,
                    to: dayjs(date as Date)
                      .set("hours", 23)
                      .set("minutes", 59)
                      .toDate(),
                  },
                })
              }
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-1 flex-wrap">
        <MultiSelect
          label="Sources"
          onChange={(sourceIds) => setFilters({ ...filters, sourceIds })}
          options={sources.map((source) => ({
            value: source.id,
            label: source.name,
          }))}
        />
        <MultiSelect
          label="Categories"
          onChange={(categoryIds) =>
            setFilters({ ...filters, categories: categoryIds })
          }
          options={categories.map((cat) => ({
            value: cat.id,
            label: cat.name,
          }))}
        />
      </div>
    </div>
  );
};

export default Filters;
