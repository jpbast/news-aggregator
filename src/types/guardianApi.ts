type Result = {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  isHosted: boolean;
  pillarId: string;
  pillarName: string;
  fields: {
    thumbnail: string;
    body: string;
    trailText: string;
  };
};

export type GuardianApi = {
  status: string;
  userTier: string;
  total: number;
  startIndex: number;
  pageSize: number;
  currentPage: number;
  pages: number;
  orderBy: string;
  results: Result[];
};

export type GuardianApiResponse = {
  response: GuardianApi;
};

export type GuardianSourceResult = {
  id: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  editions: {
    id: string;
    webTitle: string;
    webUrl: string;
    apiUrl: string;
    code: string;
  }[];
};

type GuardianSource = {
  status: string;
  userTier: string;
  total: number;
  results: GuardianSourceResult[];
};

export type GuardianSourceResponse = {
  response: GuardianSource;
};
