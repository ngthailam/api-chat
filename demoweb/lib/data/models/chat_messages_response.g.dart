// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'chat_messages_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ChatMessagesResponse _$ChatMessagesResponseFromJson(
  Map<String, dynamic> json,
) => ChatMessagesResponse(
  items: (json['items'] as List<dynamic>)
      .map((e) => ChatMessageResponseItem.fromJson(e as Map<String, dynamic>))
      .toList(),
);

Map<String, dynamic> _$ChatMessagesResponseToJson(
  ChatMessagesResponse instance,
) => <String, dynamic>{'items': instance.items};

ChatMessageResponseItem _$ChatMessageResponseItemFromJson(
  Map<String, dynamic> json,
) => ChatMessageResponseItem(
  message: json['message'] == null
      ? null
      : MessageModel.fromJson(json['message'] as Map<String, dynamic>),
  reaction: json['reaction'] == null
      ? null
      : ReactionModel.fromJson(json['reaction'] as Map<String, dynamic>),
);

Map<String, dynamic> _$ChatMessageResponseItemToJson(
  ChatMessageResponseItem instance,
) => <String, dynamic>{
  'message': instance.message,
  'reaction': instance.reaction,
};
