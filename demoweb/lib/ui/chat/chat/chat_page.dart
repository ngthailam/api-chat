import 'package:demoweb/data/models/chat_messages_response.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'chat_controller.dart';

class ChatPage extends StatefulWidget {
  const ChatPage({super.key});

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  final messageController = TextEditingController();

  @override
  void dispose() {
    messageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(ChatController());

    return Scaffold(
      appBar: AppBar(
        title: const Text('Chat'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              Get.toNamed(
                '/message-search',
                arguments: {'chatId': controller.chatId.value},
              );
            },
          ),
        ],
      ),
      body: Obx(() {
        // Show loading when creating a new chat
        if (controller.isCreatingChat.value) {
          return const Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CircularProgressIndicator(),
                SizedBox(height: 16),
                Text('Creating chat...'),
              ],
            ),
          );
        }

        return Column(
          children: [
            Expanded(
              child: Obx(() {
                final displayedMessages = controller.messages.value.reversed.toList();
                if (controller.isLoading.value) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (displayedMessages.isEmpty) {
                  return const Center(child: Text('No messages yet'));
                }
                return ListView.builder(
                  itemCount: displayedMessages.length,
                  itemBuilder: (context, index) {
                    final message = displayedMessages[index];
                    return MessageTile(
                      message: message,
                      isOwnMessage:
                          false, // TODO: Check if message is from current user
                    );
                  },
                );
              }),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: messageController,
                      decoration: const InputDecoration(
                        hintText: 'Type a message...',
                        border: OutlineInputBorder(),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    onPressed: () {
                      controller.sendMessage(text: messageController.text);
                      messageController.clear();
                    },
                    icon: const Icon(Icons.send),
                  ),
                ],
              ),
            ),
          ],
        );
      }),
    );
  }
}

class MessageTile extends StatelessWidget {
  final ChatMessageResponseItem message;
  final bool isOwnMessage;

  const MessageTile({
    super.key,
    required this.message,
    required this.isOwnMessage,
  });

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: isOwnMessage ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isOwnMessage ? Colors.blue : Colors.grey[300],
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Show sender name with online status indicator
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (!isOwnMessage)
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: Colors.grey,
                      shape: BoxShape.circle,
                    ),
                  ),
                const SizedBox(width: 4),
                Text(
                  message.info?.senderId ?? '',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                    color: isOwnMessage ? Colors.white : Colors.black87,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              message.text ?? '',
              style: TextStyle(
                color: isOwnMessage ? Colors.white : Colors.black87,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
