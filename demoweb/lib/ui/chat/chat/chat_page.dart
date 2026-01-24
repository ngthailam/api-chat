import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'chat_controller.dart';

class ChatPage extends StatelessWidget {
  const ChatPage({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(ChatController());

    return Scaffold(
      appBar: AppBar(title: const Text('Chat')),
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
                if (controller.isLoading.value) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (controller.messages.isEmpty) {
                  return const Center(child: Text('No messages yet'));
                }
                return ListView.builder(
                  itemCount: controller.messages.length,
                  itemBuilder: (context, index) {
                    final message = controller.messages[index];
                    return ListTile(
                      title: Text(message.text),
                      subtitle: Text(message.senderId),
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
                      controller: controller.messageController,
                      decoration: const InputDecoration(
                        hintText: 'Type a message...',
                        border: OutlineInputBorder(),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    onPressed: () => controller.sendMessage(),
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
