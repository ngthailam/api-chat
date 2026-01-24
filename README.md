
# Description

An backend API for a chat system. 

# Goal

- Improve backend skills.
- Can be used as an demo to demonstrate skills.

# Misc

## Commands

`npm run start`

`npm run start:dev`

`brew services start postgresql@15`

`/Volumes/Transcend/Code/flutter/bin/flutter pub run build_runner build --delete-conflicting-outputs`

# TODOs

## Core
[x] User management
[x] Authentication
[x] API Chat CRUD
[x] Send messages (real time)
[] Firebase push notification integration

## Ehance

[] Compression
[] Caching (cache search/get users ? cache chat rooms ?)
[] Security (Helmet, CORS, CRSF, https://docs.nestjs.com/security/csrf)
[] Performance (Fastify ?)
[] Race condition handling
[] Task scheduling (try accesing the database and/or notification)
[] Full text Search in chat ?
[] Add paging to some APIs (get user by name, get chats, get messages in chat)
[] Mute notification
[] Online status (Redis)
[] Reaction
[] Quote
[] Add version control (v1 v2 ?)
[] CI/CD Auto deploy/host somewhere
[] Send photos

