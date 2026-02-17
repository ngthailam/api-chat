# TODO

## Core

[x] User management
[x] Authentication
[x] API Chat CRUD
[x] Send messages (real time)
[x] Firebase push notification integration
[x] Create error response with specific custom error code
[x] Mute notification
[x] Online status (Redis)
[x] Friends system (Add-Accept-> Only then can allow Chat)
[x] Reaction
[x] Quote
[] Send photos
[x] Search text in chat
[x] Centralize all Gateway to 1 port to use the same connection

## Enhance

[x] Database migration (https://constantsolutions.dk/2024/08/05/nestjs-project-with-typeorm-cli-and-automatic-migrations/)
[x] Compression -> No need (Should offload this to a reverse proxy)
[] Caching (cache search/get users ? cache chat rooms ?)
[x] Security (Helmet, CORS, CRSF, https://docs.nestjs.com/security/csrf)
[x] Performance (Fastify ?) -> No need, this is just simple CRUD app
[] Race condition handling
[x] Task scheduling (try accesing the database and/or notification)
[x] Add paging to some APIs (get user by name, get chats, get messages in chat)
[] Add version control (v1 v2 ?)
[] CI/CD Auto deploy/host somewhere
[] Move messages to nosql ?
[x] Restructer the Model, Entity, Dto, Response thing
[x] API to load surrounding message (for search/ quote) (do after pagination)
[x] Create poll in chat


## Bug
[] Check for double creating one-one chat
[] Search text is only full word search, check for partial word search