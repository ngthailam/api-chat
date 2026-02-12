import 'package:demoweb/data/central.dart';
import 'package:flutter/foundation.dart';
// ignore: library_prefixes
import 'package:socket_io_client/socket_io_client.dart' as IO;

class WebSocketService {
  late IO.Socket socket;

  final String namespace;
  final String port;

  WebSocketService({required this.namespace, required this.port});

  void connect() {
    socket = IO.io(
      // ignore: prefer_interpolation_to_compose_strings
      'http://127.0.0.1:$port' + (namespace.isNotEmpty ? '/$namespace' : ''),
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
