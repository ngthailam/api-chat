// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'message_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MessageInfoModel _$MessageInfoModelFromJson(Map<String, dynamic> json) =>
    MessageInfoModel(
      id: json['id'] as String,
      chatId: json['chatId'] as String,
      senderId: json['senderId'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$MessageInfoModelToJson(MessageInfoModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'chatId': instance.chatId,
      'senderId': instance.senderId,
      'createdAt': instance.createdAt.toIso8601String(),
    };

ReactionModel _$ReactionModelFromJson(Map<String, dynamic> json) =>
    ReactionModel();

Map<String, dynamic> _$ReactionModelToJson(ReactionModel instance) =>
    <String, dynamic>{};
