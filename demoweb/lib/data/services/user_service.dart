import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';
import '../models/user_model.dart';

part 'user_service.g.dart';

@RestApi(baseUrl: "http://127.0.0.1:3000")
abstract class UserService {
  factory UserService(Dio dio, {String baseUrl}) = _UserService;

  @GET('user/by-email/{email}')
  Future<UserModel> findByEmail(@Path() String email);
}
