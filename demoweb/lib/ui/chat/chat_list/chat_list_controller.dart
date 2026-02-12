import 'package:demoweb/app/routes/app_routes.dart';
import 'package:demoweb/app/services/presence_service.dart';
import 'package:demoweb/data/central.dart';
import 'package:demoweb/data/models/chat_model.dart';
import 'package:demoweb/data/models/presence_request.dart';
import 'package:flutter/foundation.dart';
import 'package:get/get.dart';
import '../../../data/services/api_service.dart';

class ChatListController extends GetxController {
  // Get the ApiService from GetX dependency injection
  final ApiService apiService = Get.find<ApiService>();
  final PresenceService presenceService = Get.find<PresenceService>();

  final chats = <ChatModel>[].obs;
  final isLoading = false.obs;

  // Placeholder for loading chats
  Future<void> loadChats() async {
    // Example of using ApiService:
    final result = await apiService.getChats();
    chats.value = result;

    final users = <String>{};
    for (var e in result) {
      for (var member in e.members) {
        users.add(member.id);
      }
    }

    try {
      final mapped = users
          .map(
            (e) => PresenceRequestItem(userId: e, deviceId: Central.deviceId),
          )
          .toList();
      apiService.getPresence(PresenceRequest(userIdDeviceIdPairs: mapped));
    } catch (e) {
      if (kDebugMode) {
        print('Error fetching presence: $e');
      }
    }
  }

  // Placeholder for navigate to search chat
  void navigateToSearchChat() {
    Get.toNamed(AppRoutes.searchChat);
  }

  // Placeholder for navigate to chat
  void navigateToChat(String chatId) {
    Get.toNamed(AppRoutes.chat, arguments: {'chatId': chatId});
  }

  @override
  void onInit() {
    super.onInit();
    // Load chats
    loadChats();
  }
}
