// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'chat_messages_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ChatMessagesResponse _$ChatMessagesResponseFromJson(
  Map<String, dynamic> json,
) => ChatMessagesResponse(
  messages: (json['messages'] as List<dynamic>)
      .map((e) => ChatMessageResponseItem.fromJson(e as Map<String, dynamic>))
      .toList(),
  hasMore: json['hasMore'] as bool? ?? false,
  nextCursor: json['nextCursor'] as String?,
  total: (json['total'] as num?)?.toInt() ?? 0,
);

Map<String, dynamic> _$ChatMessagesResponseToJson(
  ChatMessagesResponse instance,
) => <String, dynamic>{
  'messages': instance.messages,
  'hasMore': instance.hasMore,
  'nextCursor': instance.nextCursor,
  'total': instance.total,
};

ChatMessageResponseItem _$ChatMessageResponseItemFromJson(
  Map<String, dynamic> json,
) => ChatMessageResponseItem(
  type: json['type'] as String,
  text: json['text'] as String?,
  info: json['info'] == null
      ? null
      : MessageInfoModel.fromJson(json['info'] as Map<String, dynamic>),
  reaction: json['reaction'] == null
      ? null
      : ReactionModel.fromJson(json['reaction'] as Map<String, dynamic>),
  quote: json['quote'] == null
      ? null
      : MessageQuoteModel.fromJson(json['quote'] as Map<String, dynamic>),
);

Map<String, dynamic> _$ChatMessageResponseItemToJson(
  ChatMessageResponseItem instance,
) => <String, dynamic>{
  'type': instance.type,
  'text': instance.text,
  'info': instance.info,
  'reaction': instance.reaction,
  'quote': instance.quote,
};

MessageQuoteModel _$MessageQuoteModelFromJson(Map<String, dynamic> json) =>
    MessageQuoteModel(
      messageId: json['messageId'] as String,
      text: json['text'] as String,
    );

Map<String, dynamic> _$MessageQuoteModelToJson(MessageQuoteModel instance) =>
    <String, dynamic>{'messageId': instance.messageId, 'text': instance.text};
