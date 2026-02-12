import 'package:demoweb/ui/chat/chat/message_search_controller.dart';
import 'package:demoweb/app/services/websocket_service.dart';
import 'package:demoweb/app/services/presence_service.dart';
import 'package:demoweb/data/central.dart';
import 'package:demoweb/data/services/api_service.dart';
import 'package:demoweb/data/utils/interceptors/access_token_interceptor.dart';
import 'package:demoweb/utils/constants.dart';
import 'package:dio/dio.dart';
import 'package:get/get.dart';
import 'package:demoweb/ui/chat/chat_list/chat_list_controller.dart';
import 'package:demoweb/ui/chat/chat/chat_controller.dart';
import 'package:demoweb/ui/chat/search_chat/search_chat_controller.dart';

class DependencyInjection {
  static void init() {
    // Dio
    final dio = Dio(
      BaseOptions(
        baseUrl: ApiConstants.baseUrl,
        headers: {'Content-Type': 'application/json'},
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
      ),
    );

    dio.interceptors.add(
      AccessTokenInterceptor(
        getToken: () async {
          return Central.accessToken;
        },
      ),
    );

    Get.put(dio);

    // ApiService - Single unified service for all REST API calls
    Get.put<ApiService>(
      ApiService(Get.find<Dio>(), baseUrl: ApiConstants.baseUrl),
    );

    // WebSocket Service
    Get.put(WebSocketService(port: '80', namespace: ''));

    // Presence Service (singleton for both ChatList and Chat pages)
    final presenceService = PresenceService();
    Get.put(presenceService, permanent: true);
    presenceService.init();
  }
}

// Page Bindings
class ChatListBindings extends Bindings {
  @override
  void dependencies() {
    Get.put(ChatListController());
  }
}

class ChatBindings extends Bindings {
  @override
  void dependencies() {
    Get.put(ChatController());
  }
}

class SearchChatBindings extends Bindings {
  @override
  void dependencies() {
    Get.put(SearchChatController());
  }
}

class MessageSearchBindings extends Bindings {
  @override
  void dependencies() {
    Get.put(MessageSearchController());
  }
}
