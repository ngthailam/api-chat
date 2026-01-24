import 'package:demoweb/app/routes/app_routes.dart';
import 'package:demoweb/data/models/chat_model.dart';
import 'package:get/get.dart';
import '../../../data/services/chat_service.dart';

class ChatListController extends GetxController {
  // Get the ChatService from GetX dependency injection
  final ChatService chatService = Get.find<ChatService>();

  final chats = <ChatModel>[].obs;
  final isLoading = false.obs;

  // Placeholder for loading chats
  Future<void> loadChats() async {
    // Example of using ChatService:
    final result = await chatService.getChats();
    chats.value = result;
  }

  // Placeholder for navigate to search chat
  void navigateToSearchChat() {
    Get.toNamed(AppRoutes.searchChat);
  }

  // Placeholder for navigate to chat
  void navigateToChat(String chatId) {
    Get.toNamed(AppRoutes.chat, arguments:  {
      'chatId': chatId
    });
  }

  @override
  void onInit() {
    super.onInit();
    loadChats();
  }
}
