import 'package:json_annotation/json_annotation.dart';

part 'chat_model.g.dart';

@JsonSerializable()
class ChatModel {
  final String id;
  final String? name;
  final List<ChatMemberModel> members;

  ChatModel({
    required this.id,
    required this.name,
    required this.members,
  });

  factory ChatModel.fromJson(Map<String, dynamic> json) =>
      _$ChatModelFromJson(json);

  Map<String, dynamic> toJson() => _$ChatModelToJson(this);
}

@JsonSerializable()
class ChatMemberModel {
  final String id;
  final String? email;
  final String? nickName;
  final String role;

  ChatMemberModel({
    required this.id,
    required this.email,
    required this.nickName,
    required this.role,
  });

  factory ChatMemberModel.fromJson(Map<String, dynamic> json) =>
      _$ChatMemberModelFromJson(json);

  Map<String, dynamic> toJson() => _$ChatMemberModelToJson(this);
}
