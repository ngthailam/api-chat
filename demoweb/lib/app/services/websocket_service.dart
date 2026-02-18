import 'package:demoweb/data/central.dart';
import 'package:demoweb/utils/constants.dart';
import 'package:flutter/foundation.dart';
// ignore: library_prefixes
import 'package:socket_io_client/socket_io_client.dart' as IO;

class WebSocketService {
  late IO.Socket socket;

  final String namespace;
  final String port;

  WebSocketService({required this.namespace, required this.port});

  void connect() {
    // Get the base URL without http:// or https://
    String baseUrl;
    if (ApiConstants.environment == ApiConstants.production) {
      // For production, extract host from production URL
      baseUrl = 'api-chat-ssve.onrender.com';
    } else {
      // For development, use localhost with the specified port
      baseUrl = '127.0.0.1:$port';
    }

    // Determine the protocol based on environment
    String protocol = ApiConstants.environment == ApiConstants.production
        ? 'https'
        : 'http';

    final String wsUrl =
        ApiConstants.environment == ApiConstants.production
            ? 'https://api-chat-ssve.onrender.com'
            : '$protocol://$baseUrl${namespace.isNotEmpty ? '/$namespace' : ''}';

    if (kDebugMode) {
      print('Connecting to WebSocket: $wsUrl');
    }

    socket = IO.io(
      wsUrl,
      IO.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .setTimeout(10000)
          .setReconnectionAttempts(3)
          .setReconnectionDelay(5000)
          .enableReconnection()
          .enableForceNew()
          .setAuth({
            'authorization': 'Bearer ${Central.accessToken}',
            'x-device-id': Central.deviceId,
          }) // Pass the raw token
          .build(),
    );

    socket.connect();

    socket.onConnect((_) {
      if (kDebugMode) {
        print('Connected to Socket.IO server');
      }
    });

    socket.onDisconnect((_) {
      if (kDebugMode) {
        print('Disconnected from Socket.IO server');
      }
    });

    socket.onError((error) {
      if (kDebugMode) {
        print('Socket.IO error: $error, desc = $error');
      }
    });
  }

  void disconnect() {
    socket.disconnect();
  }

  void emit(String event, dynamic data) {
    socket.emit(event, data);
  }

  void on(String event, Function(dynamic) callback) {
    socket.on(event, callback);
  }

  void off(String event) {
    socket.off(event);
  }
}
