import 'package:json_annotation/json_annotation.dart';

part 'message_model.g.dart';

@JsonSerializable()
class MessageInfoModel {
  final String id;
  final String chatId;
  final String senderId;
  final DateTime createdAt;

  MessageInfoModel({
    required this.id,
    required this.chatId,
    required this.senderId,
    required this.createdAt,
  });

  factory MessageInfoModel.fromJson(Map<String, dynamic> json) =>
      _$MessageInfoModelFromJson(json);

  Map<String, dynamic> toJson() => _$MessageInfoModelToJson(this);
}

@JsonSerializable()
class ReactionModel {
  const ReactionModel();

  factory ReactionModel.fromJson(Map<String, dynamic> json) =>
      _$ReactionModelFromJson(json);
  Map<String, dynamic> toJson() => _$ReactionModelToJson(this);
}
