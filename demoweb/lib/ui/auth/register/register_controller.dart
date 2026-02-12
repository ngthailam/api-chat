import 'package:demoweb/app/routes/app_routes.dart';
import 'package:demoweb/data/services/api_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class RegisterController extends GetxController {
  // Get the AuthService from GetX dependency injection
  final ApiService apiService = Get.find<ApiService>();

  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  // Placeholder for register functionality
  Future<void> register() async {
    // Example of using AuthService:
    await apiService.register(emailController.text, passwordController.text);

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
