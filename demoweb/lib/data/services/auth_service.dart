import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';
import '../models/auth_response.dart';

part 'auth_service.g.dart';

@RestApi(baseUrl: "http://127.0.0.1:3000")
abstract class AuthService {
  factory AuthService(Dio dio, {String baseUrl}) = _AuthService;

  @POST('auth/login')
  @Extra({'skipAuth': true})
  Future<AuthResponse> login(
    @Field('email') String email,
    @Field('password') String password,
  );

  @POST('auth/register')
  @Extra({'skipAuth': true})
  Future<AuthResponse> register(
    @Field('email') String email,
    @Field('password') String password,
  );
}
