import 'package:demoweb/data/models/auth_response.dart';
import 'package:demoweb/data/models/chat_model.dart';
import 'package:demoweb/data/models/chat_messages_response.dart';
import 'package:demoweb/data/models/presence_request.dart';
import 'package:demoweb/data/models/user_model.dart';
import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

part 'api_service.g.dart';

@RestApi()
abstract class ApiService {
  factory ApiService(Dio dio, {required String baseUrl}) = _ApiService;

  // ==================== Auth Endpoints ====================

  @POST('auth/login')
  @Extra({'skipAuth': true})
  Future<AuthResponse> login(
    @Field('email') String email,
    @Field('password') String password,
  );

  @POST('auth/register')
  @Extra({'skipAuth': true})
  Future<AuthResponse> register(
    @Field('email') String email,
    @Field('password') String password,
  );

  // ==================== User Endpoints ====================

  @GET('user/by-email/{email}')
  Future<List<UserModel>> findByEmail(@Path() String email);

  // ==================== Chat Endpoints ====================

  @GET('chat')
  Future<List<ChatModel>> getChats();

  @GET('chat/{id}')
  Future<ChatModel> getChat(@Path() String id);

  @POST('chat')
  Future<ChatModel> createChat(@Body() Map<String, dynamic> chat);

  // ==================== Message Endpoints ====================

  @GET('message/chat/{chatId}/messages')
  Future<ChatMessagesResponse> getAllMessageInChat(
    @Path('chatId') String chatId,
  );

  @GET('message/chat/{chatId}/messages/search')
  Future<ChatMessagesResponse> searchMessageInChat(
    @Path('chatId') String chatId,
    @Query('keyword') String keyword,
  );

  @POST('presence')
  Future<dynamic> getPresence(@Body() PresenceRequest request);
}
