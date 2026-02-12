import 'dart:async';

import 'package:demoweb/app/services/websocket_service.dart';
import 'package:get/get.dart';

/// Service for managing user presence (online/offline status)
/// This is a singleton that both ChatListPage and ChatPage can use
class PresenceService extends GetxService {
  // Singleton instance
  static PresenceService get to => Get.find<PresenceService>();

  // Reactive map: userId -> isOnline
  final onlineUsers = <String, bool>{}.obs;

  // Timer for periodic ping
  Timer? _pingTimer;

  // WebSocket service instance
  final WebSocketService webSocketService = WebSocketService(
    namespace: '',
    port: '80',
  );

  // Connection status
  final isConnected = false.obs;

  /// Initialize the presence service and start listening for presence updates
  void init() {
    webSocketService.connect();

    // Listen for connection events
    webSocketService.on('connect', (_) {
      isConnected.value = true;
      _sendPing();
    });

    webSocketService.on('disconnect', (_) {
      isConnected.value = false;
    });

    // Listen for presence updates from server
    webSocketService.on('presence:update', (data) {
      if (data != null && data is Map) {
        final userId = data['userId'] as String?;
        final status = data['status'] as String?;

        if (userId != null && status != null) {
          onlineUsers[userId] = status == 'online';
        }
      }
    });

    // Start periodic ping every 5 minutes
    _startPeriodicPing();
  }

  void _sendPing() {
    webSocketService.emit('presence:ping', {});
  }

  void _startPeriodicPing() {
    // Cancel existing timer if any
    _pingTimer?.cancel();

    // Ping every 5 minutes (300 seconds)
    _pingTimer = Timer.periodic(const Duration(seconds: 5), (_) => _sendPing());
  }

  /// Check if a user is online
  bool isUserOnline(String userId) {
    return onlineUsers[userId] ?? false;
  }

  /// Get online status as RxBool for Obx building
  RxBool getOnlineStatus(String userId) {
    // Ensure the user exists in the map
    if (!onlineUsers.containsKey(userId)) {
      onlineUsers[userId] = false;
    }
    return onlineUsers[userId]!.obs;
  }

  /// Clean up resources
  @override
  void onClose() {
    _pingTimer?.cancel();
    webSocketService.disconnect();
    super.onClose();
  }
}
