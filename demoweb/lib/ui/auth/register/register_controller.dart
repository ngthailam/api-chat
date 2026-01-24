import 'package:demoweb/app/routes/app_routes.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../data/services/auth_service.dart';

class RegisterController extends GetxController {
  // Get the AuthService from GetX dependency injection
  final AuthService authService = Get.find<AuthService>();

  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  // Placeholder for register functionality
  Future<void> register() async {
    // Example of using AuthService:
    await authService.register(
      emailController.text,
      passwordController.text,
    );

    Get.offAllNamed(AppRoutes.login);
  }

  // Navigate back to login
  void navigateToLogin() {
    Get.offAllNamed(AppRoutes.login);
  }

  @override
  void onClose() {
    emailController.dispose();
    passwordController.dispose();
    super.onClose();
  }
}
