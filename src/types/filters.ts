export type Filter = {
  keyword?: string;
  dates: {
    from: Date;
    to: Date;
  };
  categories?: string[];
  sourceIds?: string[];
};
