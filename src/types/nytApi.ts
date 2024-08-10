type Multimedia = {
  rank: number;
  subtype: string;
  caption: string | null;
  credit: string | null;
  type: string;
  url: string;
  height: number;
  width: number;
  legacy: {
    xlarge: string;
    xlargewidth: number;
    xlargeheight: number;
  };
  subType: string; // use "thumbnail"
  crop_name: string;
};

type Headline = {
  main: string;
  kicker: string | null;
  content_kicker: string | null;
  print_headline: string | null;
  name: string | null;
  seo: string | null;
  sub: string | null;
};

type Keyword = {
  name: string;
  value: string;
  rank: number;
  major: string;
};

type Byline = {
  original: string | null;
  person: unknown[]; // You can define a specific type if needed
  organization: string | null;
};

type Doc = {
  abstract: string;
  web_url: string;
  snippet: string;
  lead_paragraph: string;
  source: string;
  multimedia: Multimedia[];
  headline: Headline;
  keywords: Keyword[];
  pub_date: string; // ISO date string
  document_type: string;
  news_desk: string;
  section_name: string;
  subsection_name: string;
  byline: Byline;
  _id: string;
  word_count: number;
  uri: string;
};

type Meta = {
  hits: number;
  offset: number;
  time: number;
};

type Response = {
  docs: Doc[];
  meta: Meta;
};

export type NYTApiResponse = {
  status: string;
  copyright: string;
  response: Response;
};
