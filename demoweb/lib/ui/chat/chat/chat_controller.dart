import 'package:demoweb/data/models/chat_messages_response.dart';
import 'package:demoweb/data/models/message_model.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../data/services/api_service.dart';
import '../../../app/services/websocket_service.dart';
import '../../../app/services/presence_service.dart';

class ChatController extends GetxController {
  // Get services from GetX dependency injection
  final ApiService apiService = Get.find<ApiService>();
  final WebSocketService webSocketService = Get.find<WebSocketService>();
  final PresenceService presenceService = Get.find<PresenceService>();

  final chatId = ''.obs;
  final messages = <ChatMessageResponseItem>[].obs;
  final isLoading = false.obs;
  final isCreatingChat = false.obs;

  // Get member IDs from the chat for presence tracking
  List<String> get memberIds => _memberIds;
  List<String> _memberIds = [];

  // Load messages for the chat
  Future<void> loadMessages() async {
    if (chatId.value.isEmpty) return;

    isLoading.value = true;
    try {
      // Try to load messages from the chat
      final result = await apiService.getAllMessageInChat(chatId.value);
      messages.value = result.messages;
    } catch (e) {
      if (kDebugMode) {
        print('Error loading messages: $e');
      }
    } finally {
      isLoading.value = false;
    }
  }

  // Send a message
  Future<void> sendMessage({required String text}) async {
    final content = text.trim();
    if (content.isEmpty || chatId.value.isEmpty) return;

    try {
      // Send via WebSocket
      webSocketService.emit('send-message', {
        'text': content,
        'chatId': chatId.value,
      });
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
        print("ZZLL data = $data");
        // TODO: fix this
        try {
          final message = ChatMessageResponseItem.fromJson(data);
          messages.insert(0, message);
        } catch (e) {
          if (kDebugMode) {
            print('Error parsing new message: $e');
          }
        }
      });

      loadMessages();

      webSocketService.emit('presence:ping', null);
    }
  }

  // Create a chat with the given user ID
  Future<void> createChatWithUser(String userId) async {
    isCreatingChat.value = true;
    try {
      final chat = await apiService.createChat({
        'memberIds': [userId],
        'type': 'one-one',
      });
      chatId.value = chat.id;
      _memberIds = chat.members.map((m) => m.id.toString()).toList();

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

  // Check if a user is online
  bool isUserOnline(String userId) {
    return presenceService.isUserOnline(userId);
  }

  @override
  void onClose() {
    disconnectWebSocket();
    super.onClose();
  }
}
