# TODO

## Core

[x] User management
[x] Authentication
[x] API Chat CRUD
[x] Send messages (real time)
[x] Firebase push notification integration
[x] Create error response with specific custom error code
[x] Mute notification
[] Online status (Redis)
[x] Friends system (Add-Accept-> Only then can allow Chat)
[x] Reaction
[] Quote
[] Send photos
[] Search text in chat
[] Centralize all Gateway to 1 port to use the same connection

## Ehance

[x] Database migration (https://constantsolutions.dk/2024/08/05/nestjs-project-with-typeorm-cli-and-automatic-migrations/)
[x] Compression -> No need (Should offload this to a reverse proxy)
[] Caching (cache search/get users ? cache chat rooms ?)
[x] Security (Helmet, CORS, CRSF, https://docs.nestjs.com/security/csrf)
[x] Performance (Fastify ?) -> No need, this is just simple CRUD app
[] Race condition handling
[] Task scheduling (try accesing the database and/or notification)
[] Add paging to some APIs (get user by name, get chats, get messages in chat)
[] Add version control (v1 v2 ?)
[] CI/CD Auto deploy/host somewhere
[] Move messages to nosql ?


## Bug
[] Check for double creating one-one chat