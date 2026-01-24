import 'package:dio/dio.dart';

class AccessTokenInterceptor extends Interceptor {
  final Future<String?> Function() getToken;

  AccessTokenInterceptor({required this.getToken});

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final bool skipAuth = options.extra['skipAuth'] == true;
    if (skipAuth) {
      handler.next(options);
      return;
    }

    final token = await getToken();
    if (token != null && token.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $token';
    }

    handler.next(options);
  }
}
