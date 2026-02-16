# Description

An backend API for a chat system.

# Goal

- Improve backend skills.
- Can be used as an demo to demonstrate skills.

# Misc

## Commands

### Database commands
psql
\l
\c api_chat
\dt
\d+ message

### NestJS commands

npm run start
npm run start:dev

### System commands

appbrew services start postgresql@15
brew services start redis

### Flutter commands

/Volumes/Transcend/Code/flutter/bin/flutter pub run build_runner build --delete-conflicting-outputs

### Run specific test

npm test -- --"friend-request.service.spec.ts" --verbose

### Run all tests:

npm test

### Run tests with coverage:

npm run
test:cov

### Migration:

## Create migration
npx typeorm migration:create src/common/database/migrations/update-table-name-messages

## Run migration
node ./node_modules/typeorm/cli.js \
  -d dist/common/database/typeorm.config.js \
  migration:run

