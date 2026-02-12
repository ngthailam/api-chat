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
            return ChatListTile(chat: chat);
          },
        );
      }),
    );
  }
}

class ChatListTile extends StatelessWidget {
  final dynamic chat;

  const ChatListTile({super.key, required this.chat});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<ChatListController>();
    final presenceService = controller.presenceService;

    return Obx(() {
      // Get online status for the first member (for one-one chats)
      final firstMember = chat.members.isNotEmpty ? chat.members.first : null;
      final isOnline = firstMember != null
          ? presenceService.isUserOnline(firstMember.id)
          : false;

      return ListTile(
        leading: Stack(
          children: [
            const CircleAvatar(child: Icon(Icons.chat)),
            if (firstMember != null)
              Positioned(
                bottom: 0,
                right: 0,
                child: Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    color: isOnline ? Colors.green : Colors.grey,
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 2),
                  ),
                ),
              ),
          ],
        ),
        title: Text(chat.name ?? '(Chat with no name)'),
        subtitle: chat.members.isNotEmpty
            ? Text(chat.members.map((m) => m.nickName ?? m.email).join(', '))
            : null,
        onTap: () => controller.navigateToChat(chat.id),
      );
    });
  }
}
