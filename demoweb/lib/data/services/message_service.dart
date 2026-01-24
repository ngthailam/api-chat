import 'package:demoweb/data/models/message_model.dart';
import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

part 'message_service.g.dart';

const _messagePath = 'message';

@RestApi(baseUrl: "http://127.0.0.1:3000")
abstract class MessageService {
  factory MessageService(Dio dio, {String baseUrl}) = _MessageService;

  @GET(_messagePath)
  Future<List<MessageModel>> getAllMessageInChat(@Query('chatId') String chatId);
}
