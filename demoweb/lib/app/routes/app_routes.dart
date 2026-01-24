import 'package:demoweb/ui/auth/login/login_page.dart';
import 'package:demoweb/ui/auth/register/register_page.dart';
import 'package:demoweb/ui/chat/chat/chat_page.dart';
import 'package:demoweb/ui/chat/chat_list/chat_list_page.dart';
import 'package:demoweb/ui/chat/search_chat/search_chat_page.dart';
import 'package:get/get.dart';

class AppRoutes {
  static const String login = '/login';
  static const String register = '/register';
  static const String chatList = '/chat-list';
  static const String searchChat = '/search-chat';
  static const String chat = '/chat';

  static final routes = [
    GetPage(name: login, page: () => const LoginPage()),
    GetPage(name: register, page: () => const RegisterPage()),
    GetPage(name: chatList, page: () => const ChatListPage()),
    GetPage(name: searchChat, page: () => const SearchChatPage()),
    GetPage(name: chat, page: () => const ChatPage()),
  ];
}
