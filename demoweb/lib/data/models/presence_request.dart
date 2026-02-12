class PresenceRequest {
  final List<PresenceRequestItem> userIdDeviceIdPairs;

  PresenceRequest({required this.userIdDeviceIdPairs});

  Map<String, dynamic> toJson() => {
    'userIdDeviceIdPairs': userIdDeviceIdPairs
        .map((item) => item.toJson())
        .toList(),
  };
}

class PresenceRequestItem {
  final String userId;
  final String deviceId;

  PresenceRequestItem({required this.userId, required this.deviceId});

  Map<String, dynamic> toJson() => {'userId': userId, 'deviceId': deviceId};
}
