import 'package:demoweb/ui/auth/login/login_controller.dart';
import 'package:demoweb/ui/auth/login/login_page.dart';
import 'package:demoweb/ui/auth/register/register_page.dart';
import 'package:demoweb/ui/chat/chat/chat_page.dart';
import 'package:demoweb/ui/chat/chat/message_search_page.dart';
import 'package:demoweb/ui/chat/chat_list/chat_list_page.dart';
import 'package:demoweb/ui/chat/search_chat/search_chat_page.dart';
import 'package:get/get.dart';
import 'package:demoweb/app/bindings/dependency_injection.dart';

class AppRoutes {
  static const String login = '/login';
  static const String register = '/register';
  static const String chatList = '/chat-list';
  static const String searchChat = '/search-chat';
  static const String chat = '/chat';
  static const String messageSearch = '/message-search';

  static final routes = [
    GetPage(
      name: login,
      page: () => const LoginPage(),
      binding: LoginBindings(),
    ),
    GetPage(name: register, page: () => const RegisterPage()),
    GetPage(
      name: chatList,
      page: () => const ChatListPage(),
      binding: ChatListBindings(),
    ),
    GetPage(
      name: searchChat,
      page: () => const SearchChatPage(),
      binding: SearchChatBindings(),
    ),
    GetPage(name: chat, page: () => const ChatPage(), binding: ChatBindings()),
    GetPage(
      name: messageSearch,
      page: () => const MessageSearchPage(),
      binding: MessageSearchBindings(),
    ),
  ];
}
