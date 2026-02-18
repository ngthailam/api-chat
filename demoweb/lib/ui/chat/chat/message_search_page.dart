import 'package:demoweb/data/models/chat_messages_response.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'message_search_controller.dart';

class MessageSearchPage extends StatelessWidget {
  const MessageSearchPage({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(MessageSearchController());

    // Initialize with chatId from arguments
    final chatId =
        (Get.arguments as Map<String, dynamic>?)?['chatId'] as String? ?? '';
    controller.init(chatId);

    return Scaffold(
      appBar: AppBar(
        title: TextField(
          autofocus: true,
          decoration: const InputDecoration(
            hintText: 'Search messages...',
            border: InputBorder.none,
            hintStyle: TextStyle(color: Colors.white70),
          ),
          style: const TextStyle(color: Colors.white),
          onChanged: controller.onSearchQueryChanged,
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Get.back(),
        ),
        actions: [
          Obx(() {
            if (controller.searchQuery.isNotEmpty) {
              return IconButton(
                icon: const Icon(Icons.clear),
                onPressed: controller.clearSearch,
              );
            }
            return const SizedBox.shrink();
          }),
        ],
      ),
      body: Obx(() {
        if (controller.isSearching.value) {
          return const Center(child: CircularProgressIndicator());
        }

        if (controller.searchQuery.isEmpty) {
          return const Center(child: Text('Type to search messages'));
        }

        if (controller.searchResults.isEmpty) {
          return const Center(child: Text('No messages found'));
        }

        return ListView.builder(
          itemCount: controller.searchResults.length,
          itemBuilder: (context, index) {
            final message = controller.searchResults[index];
            return MessageSearchTile(message: message);
          },
        );
      }),
    );
  }
}

class MessageSearchTile extends StatelessWidget {
  final ChatMessageResponseItem message;

  const MessageSearchTile({super.key, required this.message});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                message.info?.senderId ?? '',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
              Text(
                _formatDate(message.info?.createdAt),
                style: const TextStyle(fontSize: 10, color: Colors.grey),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            message.text ?? '',
            style: const TextStyle(fontSize: 14),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime? createdAt) {
    if (createdAt == null) return '';
    return '${createdAt.day}/${createdAt.month}/${createdAt.year} ${createdAt.hour}:${createdAt.minute.toString().padLeft(2, '0')}';
  }
}
