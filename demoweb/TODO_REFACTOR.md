# Refactoring TODO - COMPLETED ✅

## Step 1: Create new model file
- [x] Create `demoweb/lib/data/models/presence_request.dart` with PresenceRequest and PresenceRequestItem classes

## Step 2: Create new ApiService
- [x] Create `demoweb/lib/data/services/api_service.dart` combining all 4 services
- [x] Create `demoweb/lib/data/services/api_service.g.dart` with generated Retrofit code

## Step 3: Update Dependency Injection
- [x] Update `demoweb/lib/app/bindings/dependency_injection.dart` to register only ApiService

## Step 4: Update Controllers
- [x] Update `demoweb/lib/ui/auth/login/login_controller.dart`
- [x] Update `demoweb/lib/ui/chat/chat_list/chat_list_controller.dart`
- [x] Update `demoweb/lib/ui/chat/chat/chat_controller.dart`
- [x] Update `demoweb/lib/ui/chat/search_chat/search_chat_controller.dart`

## Step 5: Delete Old Service Files
- [x] Delete `demoweb/lib/data/services/auth_service.dart`
- [x] Delete `demoweb/lib/data/services/auth_service.g.dart`
- [x] Delete `demoweb/lib/data/services/chat_service.dart`
- [x] Delete `demoweb/lib/data/services/chat_service.g.dart`
- [x] Delete `demoweb/lib/data/services/message_service.dart`
- [x] Delete `demoweb/lib/data/services/message_service.g.dart`
- [x] Delete `demoweb/lib/data/services/user_service.dart`
- [x] Delete `demoweb/lib/data/services/user_service.g.dart`

## Summary
All 4 Retrofit services (AuthService, ChatService, MessageService, UserService) have been merged into a single `ApiService` class.
WebSocket services (WebSocketService, PresenceService) were kept separate as requested.

