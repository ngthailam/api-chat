import 'package:demoweb/app/services/websocket_service.dart';
import 'package:demoweb/data/central.dart';
import 'package:demoweb/data/services/auth_service.dart';
import 'package:demoweb/data/services/chat_service.dart';
import 'package:demoweb/data/services/message_service.dart';
import 'package:demoweb/data/services/user_service.dart';
import 'package:demoweb/data/utils/interceptors/access_token_interceptor.dart';
import 'package:demoweb/utils/constants.dart';
import 'package:dio/dio.dart';
import 'package:get/get.dart';

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

    // Services
    Get.put<AuthService>(
      AuthService(Get.find<Dio>(), baseUrl: ApiConstants.baseUrl),
    );
    Get.put<ChatService>(
      ChatService(Get.find<Dio>(), baseUrl: ApiConstants.baseUrl),
    );
    Get.put<MessageService>(
      MessageService(Get.find<Dio>(), baseUrl: ApiConstants.baseUrl),
    );
    Get.put<UserService>(
      UserService(Get.find<Dio>(), baseUrl: ApiConstants.baseUrl),
    );

    // WebSocket Service
    Get.put(WebSocketService(port: '81', namespace: 'message'));
  }
}
