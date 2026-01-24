import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:get/get.dart';
import '../../../data/services/chat_service.dart';
import '../../../data/services/user_service.dart';
import '../../../data/models/user_model.dart';

class SearchChatController extends GetxController {
  // Get services from GetX dependency injection
  final UserService userService = Get.find<UserService>();
  final ChatService chatService = Get.find<ChatService>();

  final searchQuery = ''.obs;
  final searchResults = <UserModel>[].obs;
  final isSearching = false.obs;
  final isCreatingChat = false.obs;

  Timer? _debounceTimer;

  // Search functionality with 250ms debounce
  void onSearchQueryChanged(String query) {
    searchQuery.value = query;

    if (_debounceTimer != null) {
      _debounceTimer!.cancel();
    }

    if (query.isEmpty) {
      searchResults.clear();
      return;
    }

    _debounceTimer = Timer(const Duration(milliseconds: 250), () {
      searchUsers(query);
    });
  }

  // Search users by email using UserService
  Future<void> searchUsers(String email) async {
    if (email.isEmpty) {
      searchResults.clear();
      return;
    }

    isSearching.value = true;
    try {
      final user = await userService.findByEmail(email);
      searchResults.assignAll([user]);
    } catch (e) {
      if (kDebugMode) {
        print('Error searching user: $e');
      }
      searchResults.clear();
    } finally {
      isSearching.value = false;
    }
  }

  // Select a user and create a chat, then navigate to ChatPage
  Future<void> selectUser(UserModel user) async {
    isCreatingChat.value = true;
    try {
      // Create a chat with the selected user
      final chat = await chatService.createChat({
        'memberIds': [user.id],
        'type': 'one-one',
      });

      // Navigate to ChatPage with the chat ID
      Get.toNamed('/chat', arguments: {'chatId': chat.id});
    } catch (e) {
      // Still navigate even if chat creation fails, using user ID
      Get.toNamed('/chat', arguments: {'userId': user.id});
    } finally {
      isCreatingChat.value = false;
    }
  }

  // Clear search
  void clearSearch() {
    searchQuery.value = '';
    searchResults.clear();
    if (_debounceTimer != null) {
      _debounceTimer!.cancel();
      _debounceTimer = null;
    }
  }

  @override
  void onClose() {
    if (_debounceTimer != null) {
      _debounceTimer!.cancel();
    }
    super.onClose();
  }
}
