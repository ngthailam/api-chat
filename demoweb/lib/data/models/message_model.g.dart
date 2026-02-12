// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'message_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MessageModel _$MessageModelFromJson(Map<String, dynamic> json) => MessageModel(
  id: (json['id'] as num).toInt(),
  chatId: json['chatId'] as String,
  senderId: json['senderId'] as String,
  text: json['text'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
);

Map<String, dynamic> _$MessageModelToJson(MessageModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'chatId': instance.chatId,
      'senderId': instance.senderId,
      'text': instance.text,
      'createdAt': instance.createdAt.toIso8601String(),
    };

ReactionModel _$ReactionModelFromJson(Map<String, dynamic> json) =>
    ReactionModel();

Map<String, dynamic> _$ReactionModelToJson(ReactionModel instance) =>
    <String, dynamic>{};
