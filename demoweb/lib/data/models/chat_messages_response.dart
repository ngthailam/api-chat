import 'package:demoweb/data/models/message_model.dart';
import 'package:json_annotation/json_annotation.dart';

part 'chat_messages_response.g.dart';

@JsonSerializable()
class ChatMessagesResponse {
  final List<ChatMessageResponseItem> items;

  ChatMessagesResponse({required this.items});

  factory ChatMessagesResponse.fromJson(Map<String, dynamic> json) =>
      _$ChatMessagesResponseFromJson(json);

  Map<String, dynamic> toJson() => _$ChatMessagesResponseToJson(this);
}

@JsonSerializable()
class ChatMessageResponseItem {
  final MessageModel? message;
  final ReactionModel? reaction;

  ChatMessageResponseItem({required this.message, required this.reaction});

  factory ChatMessageResponseItem.fromJson(Map<String, dynamic> json) =>
      _$ChatMessageResponseItemFromJson(json);

  Map<String, dynamic> toJson() => _$ChatMessageResponseItemToJson(this);
}
