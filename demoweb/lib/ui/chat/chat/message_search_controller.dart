import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:get/get.dart';
import '../../../data/services/api_service.dart';
import '../../../data/models/chat_messages_response.dart';

class MessageSearchController extends GetxController {
  // Get services from GetX dependency injection
  final ApiService apiService = Get.find<ApiService>();

  final searchQuery = ''.obs;
  final searchResults = <ChatMessageResponseItem>[].obs;
  final isSearching = false.obs;
  final chatId = ''.obs;

  Timer? _debounceTimer;

  // Initialize with chatId
  void init(String chatId) {
    this.chatId.value = chatId;
  }

  // Search functionality with debounce
  void onSearchQueryChanged(String query) {
    searchQuery.value = query;

    if (_debounceTimer != null) {
      _debounceTimer!.cancel();
    }

    if (query.isEmpty) {
      searchResults.clear();
      return;
    }

    _debounceTimer = Timer(const Duration(milliseconds: 300), () {
      searchMessages(query);
    });
  }

  // Search messages in chat using ApiService
  Future<void> searchMessages(String keyword) async {
    if (keyword.isEmpty || chatId.value.isEmpty) {
      searchResults.clear();
      return;
    }

    isSearching.value = true;
    try {
      final results = await apiService.searchMessageInChat(
        chatId.value,
        keyword,
      );
      searchResults.value = results.messages;
    } catch (e) {
      if (kDebugMode) {
        print('Error searching messages: $e');
      }
      searchResults.clear();
    } finally {
      isSearching.value = false;
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
