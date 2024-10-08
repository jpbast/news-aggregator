<p>
  <img style="flex:1" src="https://res.cloudinary.com/jpbast/image/upload/v1723332329/Personal/67da1ab6-0d8e-418c-8f9f-14780e3df802.png" />
</p>

# News Aggregator

For checking the online version you can click [here](https://news-aggregator-jpbast.vercel.app/). Notice that there are a few limitations due to the APIs free account restrictions.

## How to run the project

First thing you should do is to get your own API keys for the News API, The Guardian API and NYT API.
Then, copy the `.env.example` variables to a `.env` file and add the correct values.

After adding the env values, you can install and run the project through two different ways:

### Docker

1. In your terminal, run `docker-compose up --build`
2. The app should be running at `http://localhost:3000`

### Manually

1. Make sure you are using Node version `20.14.0` to avoid any errors
2. Run `yarn` on terminal to install the dependencies
3. Then run `yarn dev`
4. The app should be running at `http://localhost:3000`

## The app

The app is a fully responsive single-page application that displays news from various sources. At the top of the page, there are filters, and below them, the news articles are displayed in a grid layout.

To enhance performance and user experience, infinite scrolling has been implemented. More news will load as the user scrolls down the page.

## Limitations

Due to the restrictions of the free API accounts, there are a few limitations in the app:

- Article Age: You cannot retrieve articles older than one month. As a result, the Start Date filter is limited to dates from no more than one month ago.

- Pagination: The pagination is limited, so even with infinite scrolling, you may not be able to load a large number of articles. This is due to the constraints imposed by the APIs.

- Requests limits: If you visit the online app, keep in mind that it's using free API tokens. So depending on the amount of users visiting it, maybe some requests will reach their limits really soon.

## Data Handling

All news articles are retrieved from three different APIs:

- [The New York Times](https://developer.nytimes.com/docs/articlesearch-product/1/overview)
- [The Guardian](https://open-platform.theguardian.com/documentation/)
- [News API](https://newsapi.org/docs)

To efficiently handle this data and improve performance, the app uses [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview). This package offers a great development experience along with an out-of-the-box cache layer.

## Custom Hooks

To manage data and separate concerns from UI components, several custom hooks have been created:

- ### `useNewsByApiSource`

  This hook fetches news data based on the API specified in the props (NYT, Guardian, or News API).

- ### `useCategories`

  Retrieves and parses all categories provided by each API. Note that only The Guardian API offers an endpoint for fetching categories. The NYT API provides a list in their documentation, so I hardcoded it in the nytCategories.ts file. Lastly, the News API neither offers an endpoint nor a list, so its categories were excluded and are only filtered on the frontend.

- ### `useSources`

  Retrieves all available news sources. Since NYT and Guardian only provide their own sources, all other sources are retrieved from the News API.

- ### `useNews`
  This hook does not perform any data fetching. Instead, it serves as part of a Facade Architecture, calling the data from the three different APIs through the useNewsByApiSource hook, parsing it into a single news array, and managing the loading and error states from the useNewsByApiSource calls.

## Technologies used

- React
- TanStack Query
- Tailwind
- TypeScript
