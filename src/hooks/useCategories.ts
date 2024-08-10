import { Category } from "@/types/category";
import { GuardianSourceResponse } from "@/types/guardianApi";
import { guardianAxios } from "@/utils/axios";
import { nytCategories } from "@/utils/nytCategories";
import { useQuery } from "@tanstack/react-query";

const getCategories = async () => {
  const { data } = await guardianAxios.get<GuardianSourceResponse>(
    `/sections?api-key=${import.meta.env.VITE_GUARDIAN_API_KEY}`
  );

  return data;
};

const keepUniqueCategories = (categories: Category[]) =>
  Array.from(
    categories
      .reduce(
        (prev, curr) => prev.set(curr.name.toLowerCase(), curr),
        new Map()
      )
      .values()
  ) as Category[];

export default function useCategories() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const res = data?.response.results;

  const parsedGuardianCategories: Category[] = res
    ? res.map(
        (r) =>
          ({ id: r.id, name: r.webTitle, apiSource: "Guardian" } as Category)
      )
    : [];

  const parsedData = keepUniqueCategories([
    ...parsedGuardianCategories,
    ...nytCategories,
  ]);

  return {
    data: parsedData.sort((a, b) => (a.name || "").localeCompare(b.name || "")),
    isLoading,
    error,
  };
}
