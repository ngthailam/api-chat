import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'chat_list_controller.dart';

class ChatListPage extends StatelessWidget {
  const ChatListPage({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(ChatListController());

    return Scaffold(
      appBar: AppBar(
        title: const Text('Chats'),
        actions: [
          IconButton(
            onPressed: () => controller.navigateToSearchChat(),
            icon: const Icon(Icons.search),
          ),
        ],
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }
        if (controller.chats.isEmpty) {
          return const Center(child: Text('No chats yet'));
        }
        return ListView.builder(
          itemCount: controller.chats.length,
          itemBuilder: (context, index) {
            final chat = controller.chats[index];
            return ListTile(
              leading: const CircleAvatar(child: Icon(Icons.chat)),
              title: Text(chat.id),
              subtitle: Text(chat.name ?? '(Chat with no name)'),
              onTap: () => controller.navigateToChat(chat.id),
            );
          },
        );
      }),
    );
  }
}
