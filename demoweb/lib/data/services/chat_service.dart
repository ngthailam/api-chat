import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';
import '../models/chat_model.dart';

part 'chat_service.g.dart';

const _chatPath = 'chat';

@RestApi(baseUrl: "http://127.0.0.1:3000")
abstract class ChatService {
  factory ChatService(Dio dio, {String baseUrl}) = _ChatService;

  @GET(_chatPath)
  Future<List<ChatModel>> getChats();

  @GET('$_chatPath/{id}')
  Future<ChatModel> getChat(@Path() String id);

  @POST(_chatPath)
  Future<ChatModel> createChat(@Body() Map<String, dynamic> chat);
}
