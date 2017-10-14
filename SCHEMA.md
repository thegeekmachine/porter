## Database Schema

Going with a traditional RDMS approach:

__Pro__

- As it allows to multiple access points (import and export becomes easy)
- Lets you model as per the logical model
- maintains transactionality via ACID which is much needed

__Cons__

- might result in complicated query + joins
- vertical scaling

### users

| id | serviceId | name | accessToken | refreshToken |
| --- | --- | --- | --- | --- |

> Below table will lead to duplication but read is easier
> Other alternatives: Make it as a separate table / merge it with
[service](#service)

| serviceId | clientId | clientSecret | clientScopes | redirectURI |
| --- | --- | --- | --- | -- |

### services

| id | name | thumbnail | images |
| --- | --- | --- | --- |
||| Optional | Optional |

### playlists

| id | name | serviceId | uri | photo |
| --- | --- | --- | --- | --- |
||||| Optional |

### tracks

| id | title | photo |
| --- | --- | --- |
||| Optional |

### artists

| id | name | photo |
| --- | --- | --- |
||| Optional |


### user-playlist

| userId | playlistId |
| --- | --- |

### track-service

| trackId | serviceId | uri |
| --- | --- | --- |

### track-artist

| trackId | artistId |
| --- | --- |

### playlist-track

| playlistId | trackId |
| --- | --- |
