# best Movie of all time Server

## Requirements

- Node.js v20.12.2
- npm v10.5.2
- Docker
- MongoDB

## Installation

1. Clone the repository:
   [Best Movie of All time](https://github.com/mohamedelraghy/best-movie-of-all-time.git)

```bash
$ git clone https://github.com/mohamedelraghy/best-movie-of-all-time.git
```

2. Install the dependencies:

```bash
$ cd best-movie-of-all-time
$ npm i
```

## Running the app 🚀

- copy config/.env.example and rename it to config/.env.development
- replace environment variables values with you values

1. Development mode

```bash
$ cp config/.env.example  config/.env.development

# development
$ npm run start

# watch mode
$ npm run start:dev
```

2 - production mode

```bash
$ cp config/.env.example config/.env.production

# build app
$ npm run build

# production mode
$ npm run start:prod
```

3 - Docker

```bash
$ cp config/.env.example config/.env.production

$ docker-compose down && docker-compose build && docker-compose up -d
```

## Api Documentation 📖

After running the a server you could access swagger UI : [API Documentation](http://localhost:8080/api)

### Entities

#### Movie

A Movie has the following attributes:

- `_id` (ObjectId): MongoDB unique identifier
- `title`(String): Movie Title
- `adult`(Boolean): flag to identify that movie is for adult or not
- `tmdbId`(Number): unique identifier for the movie at TMDB api
- `overview`(String): Movie Overview
- `popularity`(Number): popularity of the movie
- `release_date`(String): Movie release Date
- `vote_average`(Number): Movie Average voting
- `vote_count`(Number): total number of votes
- `genre`([String]): Movie Genres
- `imdbDetails`(Object): additional info about movie from IMDB

### Endpoints

#### `POST /api/v1/movies/sync`

seed, store, and sync the data from uploaded CSV file

`request body : file contains movie data`

<details>
<summary>Response</summary>

```json
{
  "newlyAddedMovies": 5,
  "movies": [
    {
      "adult": false,
      "backdrop_path": "/8wdxa4JgiAXvITgqkra1W0Dpii5.jpg",
      "genre_ids": [28, 18, 36],
      "id": 11645,
      "original_language": "ja",
      "original_title": "乱",
      "overview": "With Ran, legendary director Akira Kurosawa reimagines Shakespeare's King Lear as a singular historical epic set in sixteenth-century Japan. Majestic in scope, the film is Kurosawa's late-life masterpiece, a profound examination of the folly of war and the crumbling of one family under the weight of betrayal, greed, and the insatiable thirst for power.",
      "popularity": 30.732,
      "poster_path": "/jQnUtWaHYfqnXPOIf77K7Ycqk4M.jpg",
      "release_date": "1985-06-01",
      "title": "Ran",
      "video": false,
      "vote_average": 8.075,
      "vote_count": 1458,
      "genre": ["Action", "Drama", "War"],
      "tmdbId": 11645
    },
    {
      "adult": false,
      "backdrop_path": "/yiglnLtYEH6UGY1qFy4zacixCXf.jpg",
      "genre_ids": [37, 18, 10749],
      "id": 26596,
      "original_language": "en",
      "original_title": "Johnny Guitar",
      "overview": "On the outskirts of town, the hard-nosed Vienna owns a saloon frequented by the undesirables of the region, including Dancin' Kid and his gang. Another patron of Vienna's establishment is Johnny Guitar, a former gunslinger and her lover. When a heist is pulled in town that results in a man's death, Emma Small, Vienna's rival, rallies the townsfolk to take revenge on Vienna's saloon – even without proof of her wrongdoing.",
      "popularity": 24.235,
      "poster_path": "/bap37yOCwcR9x4YDsNUaSo9nIp9.jpg",
      "release_date": "1954-05-26",
      "title": "Johnny Guitar",
      "video": false,
      "vote_average": 7.397,
      "vote_count": 401,
      "genre": ["Drama", "Western"],
      "tmdbId": 26596
    },
    {
      "adult": false,
      "backdrop_path": "/atMZwFMnbTEvOpGOh9zFob2yt9T.jpg",
      "genre_ids": [35, 18, 36, 10752],
      "id": 986,
      "original_language": "en",
      "original_title": "Campanadas a medianoche",
      "overview": "Henry IV usurps the English throne, sets in motion the factious War of the Roses and now faces a rebellion led by Northumberland scion Hotspur. Henry's heir, Prince Hal, is a ne'er-do-well carouser who drinks and causes mischief with his low-class friends, especially his rotund father figure, John Falstaff. To redeem his title, Hal may have to choose between allegiance to his real father and loyalty to his friend.",
      "popularity": 12.967,
      "poster_path": "/5Fjxyz3u2Zdco4WeuC3wQ6O5tYQ.jpg",
      "release_date": "1965-12-23",
      "title": "Chimes at Midnight",
      "video": false,
      "vote_average": 7.222,
      "vote_count": 194,
      "genre": ["Comedy", "Drama", "History"],
      "tmdbId": 986
    },
    {
      "adult": false,
      "backdrop_path": "/rg3hBiQbDet8uNQkgfbpk7306p8.jpg",
      "genre_ids": [27, 14, 9648],
      "id": 779,
      "original_language": "de",
      "original_title": "Vampyr - Der Traum des Allan Grey",
      "overview": "A student of the occult encounters supernatural haunts and local evildoers in a village outside of Paris.",
      "popularity": 16.169,
      "poster_path": "/yt3JS5JSoZseSohYkhs6FLU9B0O.jpg",
      "release_date": "1932-05-06",
      "title": "Vampyr",
      "video": false,
      "vote_average": 7.3,
      "vote_count": 488,
      "genre": ["Fantasy", "Horror"],
      "tmdbId": 779
    },
    {
      "adult": false,
      "backdrop_path": "/p7xReCSm4lSmStrQdHWVuLEdL2Q.jpg",
      "genre_ids": [18, 10749],
      "id": 41050,
      "original_language": "it",
      "original_title": "La notte",
      "overview": "A day in the life of an unfaithful married couple and their steadily deteriorating relationship in Milan.",
      "popularity": 25.491,
      "poster_path": "/oMXUmRs774wKN4MpGLKtMSslgq5.jpg",
      "release_date": "1961-01-24",
      "title": "La Notte",
      "video": false,
      "vote_average": 7.931,
      "vote_count": 634,
      "genre": ["Drama"],
      "tmdbId": 41050
    }
  ]
}
```

</details>

#### `POST  /api/v1/movies/search`

search for synced movie using search options

<details>
<summary>Request Body</summary>

```json
{
  "offset": 0,
  "size": 10,
  "sort": "",
  "dir": "asc",
  "searchTerm": "",
  "filterBy": [{ "genre": "Drama" }],
  "attributesToRetrieve": []
}
```

use filter by field in request body to pass any object to filter with
ex: `filter with Drama genre`

</details>

<details>
<summary>Response</summary>

```json
{
  "count": 31,
  "content": [
    {
      "_id": "664270985085ffc58be732a1",
      "title": "Citizen Kane",
      "adult": false,
      "tmdbId": 15,
      "overview": "Newspaper magnate Charles Foster Kane is taken from his mother as a boy and made the ward of a rich industrialist. As a result, every well-meaning, tyrannical or self-destructive move he makes for the rest of his life appears in some way to be a reaction to that deeply wounding event.",
      "popularity": 332.851,
      "release_date": "1941-04-17",
      "vote_average": 8.01,
      "vote_count": 5299,
      "genre": [
        "Drama",
        "Mystery"
      ],
      "createdAt": "2024-05-13T19:57:12.975Z",
      "updatedAt": "2024-05-13T22:48:03.375Z",
      "imdbDetails": {
        "Title": "Citizen Kane",
        "Year": "1941",
        "Rated": "PG",
        "Released": "05 Sep 1941",
        "Runtime": "119 min",
        "Genre": "Drama, Mystery",
        "Director": "Orson Welles",
        "Writer": "Herman J. Mankiewicz, Orson Welles, John Houseman",
        "Actors": "Orson Welles, Joseph Cotten, Dorothy Comingore",
        "Plot": "Following the death of publishing tycoon Charles Foster Kane, reporters scramble to uncover the meaning of his final utterance: 'Rosebud.'",
        "Language": "English, Italian",
        "Country": "United States",
        "Awards": "Won 1 Oscar. 11 wins & 13 nominations total",
        "Poster": "https://m.media-amazon.com/images/M/MV5BYjBiOTYxZWItMzdiZi00NjlkLWIzZTYtYmFhZjhiMTljOTdkXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
        "Ratings": [
          {
            "Source": "Internet Movie Database",
            "Value": "8.3/10"
          },
          {
            "Source": "Rotten Tomatoes",
            "Value": "99%"
          },
          {
            "Source": "Metacritic",
            "Value": "100/100"
          }
        ],
        "Metascore": "100",
        "imdbRating": "8.3",
        "imdbVotes": "464,150",
        "imdbID": "tt0033467",
        "Type": "movie",
        "DVD": "28 Jun 2016",
        "BoxOffice": "$1,627,530",
        "Production": "N/A",
        "Website": "N/A",
        "Response": "True"
      }
    },
    {
      "_id": "664270985085ffc58be732a4",
      "title": "Tokyo Story",
      "adult": false,
      "tmdbId": 18148,
      "overview": "The elderly Shukishi and his wife, Tomi, take the long journey from their small seaside village to visit their adult children in Tokyo. Their elder son, Koichi, a doctor, and their daughter, Shige, a hairdresser, don't have much time to spend with their aged parents, and so it falls to Noriko, the widow of their younger son who was killed in the war, to keep her in-laws company.",
      "popularity": 23.555,
      "release_date": "1953-11-03",
      "vote_average": 8.17,
      "vote_count": 995,
      "genre": [
        "Drama"
      ],
      "createdAt": "2024-05-13T19:57:12.978Z",
      "updatedAt": "2024-05-13T19:57:12.978Z"
    },
    {
      "_id": "664270985085ffc58be732a5",
      "title": "The Rules of the Game",
      "adult": false,
      "tmdbId": 776,
      "overview": "A weekend at a marquis’ country château lays bare some ugly truths about a group of haut bourgeois acquaintances.",
      "popularity": 11.675,
      "release_date": "1939-07-09",
      "vote_average": 7.543,
      "vote_count": 552,
      "genre": [
        "Comedy",
        "Drama"
      ],
      "createdAt": "2024-05-13T19:57:12.979Z",
      "updatedAt": "2024-05-13T19:57:12.979Z"
    }
   ]
}

```
</details>


#### `POST /api/v1/movies/add/watchlist -  /api/v1/movies/add/favorite`

add movie to watchlist or favorite and add additional details from IMDB

<summary> watchlist - favorite request body examples provided at swagger UI </summary>


#### `GET api/v1/movies/list/watchlist - api/v1/movies/list/favorite`
Get all watchlist or favorite Movies

<details>
<summary> Response</summary>


```json
{
  "page": 1,
  "results": [
    {
      "adult": false,
      "backdrop_path": "/5YLNDnkO0cZZwog2StyR3YmmBPh.jpg",
      "genre_ids": [
        18,
        10749
      ],
      "id": 597,
      "original_language": "en",
      "original_title": "Titanic",
      "overview": "101-year-old Rose DeWitt Bukater tells the story of her life aboard the Titanic, 84 years later. A young Rose boards the ship with her mother and fiancé. Meanwhile, Jack Dawson and Fabrizio De Rossi win third-class tickets aboard the ship. Rose tells the whole story from Titanic's departure through to its death—on its first and last voyage—on April 15, 1912.",
      "popularity": 150.308,
      "poster_path": "/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
      "release_date": "1997-11-18",
      "title": "Titanic",
      "video": false,
      "vote_average": 7.905,
      "vote_count": 24634,
      "imdbDetails": {
        "Title": "Titanic",
        "Year": "1997",
        "Rated": "PG-13",
        "Released": "19 Dec 1997",
        "Runtime": "194 min",
        "Genre": "Drama, Romance",
        "Director": "James Cameron",
        "Writer": "James Cameron",
        "Actors": "Leonardo DiCaprio, Kate Winslet, Billy Zane",
        "Plot": "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
        "Language": "English, Swedish, Italian, French",
        "Country": "United States, Mexico",
        "Awards": "Won 11 Oscars. 126 wins & 83 nominations total",
        "Poster": "https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg",
        "Ratings": [
          {
            "Source": "Internet Movie Database",
            "Value": "7.9/10"
          },
          {
            "Source": "Rotten Tomatoes",
            "Value": "88%"
          },
          {
            "Source": "Metacritic",
            "Value": "75/100"
          }
        ],
        "Metascore": "75",
        "imdbRating": "7.9",
        "imdbVotes": "1,280,439",
        "imdbID": "tt0120338",
        "Type": "movie",
        "DVD": "01 Jun 2014",
        "BoxOffice": "$674,292,608",
        "Production": "N/A",
        "Website": "N/A",
        "Response": "True"
      }
    },
    {
      "adult": false,
      "backdrop_path": "/ruF3Lmd4A8MHbnEBE6lxPMbsHGL.jpg",
      "genre_ids": [
        9648,
        18
      ],
      "id": 15,
      "original_language": "en",
      "original_title": "Citizen Kane",
      "overview": "Newspaper magnate Charles Foster Kane is taken from his mother as a boy and made the ward of a rich industrialist. As a result, every well-meaning, tyrannical or self-destructive move he makes for the rest of his life appears in some way to be a reaction to that deeply wounding event.",
      "popularity": 374.854,
      "poster_path": "/sav0jxhqiH0bPr2vZFU0Kjt2nZL.jpg",
      "release_date": "1941-04-17",
      "title": "Citizen Kane",
      "video": false,
      "vote_average": 8.009,
      "vote_count": 5301,
      "imdbDetails": {
        "Title": "Citizen Kane",
        "Year": "1941",
        "Rated": "PG",
        "Released": "05 Sep 1941",
        "Runtime": "119 min",
        "Genre": "Drama, Mystery",
        "Director": "Orson Welles",
        "Writer": "Herman J. Mankiewicz, Orson Welles, John Houseman",
        "Actors": "Orson Welles, Joseph Cotten, Dorothy Comingore",
        "Plot": "Following the death of publishing tycoon Charles Foster Kane, reporters scramble to uncover the meaning of his final utterance: 'Rosebud.'",
        "Language": "English, Italian",
        "Country": "United States",
        "Awards": "Won 1 Oscar. 11 wins & 13 nominations total",
        "Poster": "https://m.media-amazon.com/images/M/MV5BYjBiOTYxZWItMzdiZi00NjlkLWIzZTYtYmFhZjhiMTljOTdkXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
        "Ratings": [
          {
            "Source": "Internet Movie Database",
            "Value": "8.3/10"
          },
          {
            "Source": "Rotten Tomatoes",
            "Value": "99%"
          },
          {
            "Source": "Metacritic",
            "Value": "100/100"
          }
        ],
        "Metascore": "100",
        "imdbRating": "8.3",
        "imdbVotes": "464,150",
        "imdbID": "tt0033467",
        "Type": "movie",
        "DVD": "28 Jun 2016",
        "BoxOffice": "$1,627,530",
        "Production": "N/A",
        "Website": "N/A",
        "Response": "True"
      }
    }
  ],
  "total_pages": 1,
  "total_results": 2
}

```

</details>