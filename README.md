# render

Render is a collection of potentially useful renderless Vue.js components. Renderless components, as the name suggests, have no UI definition. These components merely provide the logic and internal functionality for you to use. This allows for you to create the front-end look and feel, define accessiblity, and handle semantics without needing to code the logic behind the component.

Each component is documented below and has a live example of how it could be used.

## Getting started

Install from npm
Import component

## Fuzzy Search

### Configuration

| Prop      | Description                                                          | Type/Options | Default |
| --------- | -------------------------------------------------------------------- | ------------ | ------- |
| data      | The data to search for results in                                    | Array        | []      |
| query     | The query used to perform a search                                   | String       | null    |
| useWorker | Perform search work in a dedicated Web Worker ([when to use this]()) | Boolean      | false   |
| paged     | Paginate the results                                                 | Boolean      | false   |
| pageSize  | If paged, the number of results to return                            | Number       | 50      |
| page      | The current page of results                                          | Number       | 1       |

#### How search is performed

Internally, the search functionality is very similar to Kent Dodd's [match-sorter](https://github.com/kentcdodds/match-sorter) library. We rank the searchable strings and then sort them by those rankings.

The rankings are as follows

1. **Case sensitive equality** - The query matches the searchable string exactly e.g. HeLLo = HeLLo and HeLLo != Hello
2. **Case insensitive equality** - The query matches the searchable string except in case e.g. HeLLo = hello and hello = Hello

Below rankings are case-insensitive

3. **Starts with** - The query matches the beginning of a searchable string e.g. "excu" matches “<mark>Excuse</mark> me. I believe you have my stapler.”
4. **Any word starts with** - The query matches the beginning of any word in the search string e.g. "belie" matches “Excuse me. I <mark>believe</mark> you have my stapler.”
5. **Contains** - The searchable string contains the query somewhere e.g. "xcus" matches “<mark>Excuse</mark> me. I believe you have my stapler.”
6. **In-order subsequence** - The searchable string contains the query in-order but may have letters in between the query letters e.g. "Ecse" matches "<mark>Excuse</mark> me. I believe you have my stapler.”
7. **Out-of-order subsequence** - The searchable string contains the query but the letters may be out-of-order and have other letters or spaces in between the query letters e.g. "eecuxs" matches “<mark>Excuse</mark> me. I believe you have my stapler.”

#### When to use a dedicated web worker

A dedicated web worker is most useful when you have a large set of data that you want to search through. This is useful because it allows us to perform the intensive task of searching and sorting through a large dataset without blocking the main UI thread of your application.

[Here]() is a test of this feature that allows you to search through 100,000 records while keeping the UI responsive.

Internally, if the user's browser does not support web workers we fall back to searching on the UI thread.

## Contributing

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```

### Run your end-to-end tests

```
npm run test:e2e
```

### Run your unit tests

```
npm run test:unit
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
