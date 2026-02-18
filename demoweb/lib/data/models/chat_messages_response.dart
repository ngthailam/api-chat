import 'package:demoweb/data/models/message_model.dart';
import 'package:json_annotation/json_annotation.dart';

part 'chat_messages_response.g.dart';

@JsonSerializable()
class ChatMessagesResponse {
  final List<ChatMessageResponseItem> messages;
  final bool hasMore;
  final String? nextCursor;
  final int total;

  ChatMessagesResponse({
    required this.messages,
    this.hasMore = false,
    this.nextCursor,
    this.total = 0,
  });

  factory ChatMessagesResponse.fromJson(Map<String, dynamic> json) =>
      _$ChatMessagesResponseFromJson(json);

  Map<String, dynamic> toJson() => _$ChatMessagesResponseToJson(this);
}

@JsonSerializable()
class ChatMessageResponseItem {
  final String type;
  final String? text;
  final MessageInfoModel? info;
  final ReactionModel? reaction;
  final MessageQuoteModel? quote;

  ChatMessageResponseItem({
    required this.type,
    this.text,
    this.info,
    this.reaction,
    this.quote,
  });

  factory ChatMessageResponseItem.fromJson(Map<String, dynamic> json) =>
      _$ChatMessageResponseItemFromJson(json);

  Map<String, dynamic> toJson() => _$ChatMessageResponseItemToJson(this);
}

@JsonSerializable()
class MessageQuoteModel {
  final String messageId;
  final String text;

  MessageQuoteModel({required this.messageId, required this.text});

  factory MessageQuoteModel.fromJson(Map<String, dynamic> json) =>
      _$MessageQuoteModelFromJson(json);

  Map<String, dynamic> toJson() => _$MessageQuoteModelToJson(this);
}
