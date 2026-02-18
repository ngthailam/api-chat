// API Constants
class ApiConstants {
  // Environment names
  static const String development = 'development';
  static const String production = 'production';

  // Default environment
  static const String defaultEnvironment = development;

  // Environment URLs
  static const String _developmentBaseUrl = 'http://localhost:3000/';
  static const String _productionBaseUrl =
      'https://api-chat-ssve.onrender.com/';

  // Get environment from --dart-define or use default
  static String get environment => const String.fromEnvironment(
    'ENVIRONMENT',
    defaultValue: defaultEnvironment,
  );

  // Get baseUrl based on environment
  static String get baseUrl =>
      environment == production ? _productionBaseUrl : _developmentBaseUrl;

  // Get WebSocket URL based on environment
  static String get wsUrl {
    if (environment == production) {
      return 'wss://api-chat-ssve.onrender.com/ws';
    }
    return 'ws://localhost:3000/ws';
  }
}

// WebSocket Constants
class WebSocketConstants {
  static const String wsUrl = 'ws://localhost:3000/ws';
}
