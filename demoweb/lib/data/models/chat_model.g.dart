// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'chat_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ChatModel _$ChatModelFromJson(Map<String, dynamic> json) => ChatModel(
  id: json['id'] as String,
  name: json['name'] as String?,
  members: (json['members'] as List<dynamic>)
      .map((e) => ChatMemberModel.fromJson(e as Map<String, dynamic>))
      .toList(),
);

Map<String, dynamic> _$ChatModelToJson(ChatModel instance) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'members': instance.members,
};

ChatMemberModel _$ChatMemberModelFromJson(Map<String, dynamic> json) =>
    ChatMemberModel(
      id: json['id'] as String,
      email: json['email'] as String,
      nickName: json['nickName'] as String?,
      role: json['role'] as String,
    );

Map<String, dynamic> _$ChatMemberModelToJson(ChatMemberModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'nickName': instance.nickName,
      'role': instance.role,
    };
