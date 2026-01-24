import 'package:demoweb/data/models/message_model.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../data/services/chat_service.dart';
import '../../../data/services/message_service.dart';
import '../../../app/services/websocket_service.dart';

class ChatController extends GetxController {
  // Get services from GetX dependency injection
  final ChatService chatService = Get.find<ChatService>();
  final MessageService messageService = Get.find<MessageService>();
  final WebSocketService webSocketService = Get.find<WebSocketService>();

  final chatId = ''.obs;
  final messages = <MessageModel>[].obs;
  final messageController = TextEditingController();
  final isLoading = false.obs;
  final isCreatingChat = false.obs;

  // Load messages for the chat
  Future<void> loadMessages() async {
    if (chatId.value.isEmpty) return;

    isLoading.value = true;
    try {
      // Try to load messages from the chat
      final result = await messageService.getAllMessageInChat(chatId.value);
      messages.value = result;
    } catch (e) {
      if (kDebugMode) {
        print('Error loading messages: $e');
      }
    } finally {
      isLoading.value = false;
    }
  }

  // Send a message
  Future<void> sendMessage() async {
    final content = messageController.text.trim();
    if (content.isEmpty || chatId.value.isEmpty) return;

    try {
      // Send via WebSocket
      webSocketService.emit('send-message', {
        'text': content,
        'chatId': chatId.value,
      });

      messageController.clear();
    } catch (e) {
      if (kDebugMode) {
        print('Error sending message: $e');
      }
    }
  }

  // Disconnect WebSocket
  void disconnectWebSocket() {
    webSocketService.disconnect();
  }

  @override
  void onInit() {
    super.onInit();

    if (Get.arguments != null) {
      final argument = (Get.arguments as Map<String, dynamic>?) ?? {};
      final chatId = (argument['chatId'] as String?) ?? '';
      final userId = (argument['userId'] as String?) ?? '';

      if (chatId.isNotEmpty) {
        this.chatId.value = chatId;
      } else if (userId.isNotEmpty) {
        // Create a new chat ?
      } else {
        Get.back();
      }
    }

    // Connect to WebSocket when entering chat
    if (chatId.value.isNotEmpty) {
      webSocketService.connect();
      webSocketService.emit('join-chat', {'chatId': chatId.value});

      webSocketService.on('new-message', (data) {
        final message = MessageModel.fromJson(data);
        messages.add(message);
      });

      loadMessages();
    }
  }

  // Create a chat with the given user ID
  Future<void> createChatWithUser(String userId) async {
    isCreatingChat.value = true;
    try {
      final chat = await chatService.createChat({
        'memberIds': [userId],
        'type': 'one-one',
      });
      chatId.value = chat.id;

      // Now connect to WebSocket and load messages
      webSocketService.connect();
      loadMessages();
    } catch (e) {
      if (kDebugMode) {
        print('Error creating chat: $e');
      }
    } finally {
      isCreatingChat.value = false;
    }
  }

  @override
  void onClose() {
    messageController.dispose();
    disconnectWebSocket();
    super.onClose();
  }
}
