import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'search_chat_controller.dart';
import '../../../data/models/user_model.dart';

class SearchChatPage extends StatelessWidget {
  const SearchChatPage({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(SearchChatController());

    return Scaffold(
      appBar: AppBar(
        title: TextField(
          decoration: const InputDecoration(
            hintText: 'Search user by email...',
            border: InputBorder.none,
          ),
          onChanged: (value) => controller.onSearchQueryChanged(value),
          autofocus: true,
        ),
      ),
      body: Obx(() {
        // Show loading when creating chat
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

        // Show searching indicator
        if (controller.isSearching.value) {
          return const Center(child: CircularProgressIndicator());
        }

        // Show message when no results
        if (controller.searchResults.isEmpty &&
            controller.searchQuery.isNotEmpty) {
          return const Center(child: Text('No user found'));
        }

        // Show empty state
        if (controller.searchQuery.isEmpty) {
          return const Center(
            child: Text('Enter an email to search for a user'),
          );
        }

        // Show search results
        return ListView.builder(
          itemCount: controller.searchResults.length,
          itemBuilder: (context, index) {
            final user = controller.searchResults[index];
            return UserListItem(user: user);
          },
        );
      }),
    );
  }
}

class UserListItem extends StatelessWidget {
  final UserModel user;

  const UserListItem({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<SearchChatController>();

    return ListTile(
      leading: CircleAvatar(
        child: Text(user.email.isNotEmpty ? user.email[0].toUpperCase() : '?'),
      ),
      title: Text(user.email),
      subtitle: const Text('Tap to start chat'),
      onTap: () => controller.selectUser(user),
    );
  }
}
