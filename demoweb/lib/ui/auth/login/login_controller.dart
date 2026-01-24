import 'package:demoweb/app/routes/app_routes.dart';
import 'package:demoweb/data/central.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../data/services/auth_service.dart';

class LoginController extends GetxController {
  // Get the AuthService from GetX dependency injection
  final AuthService authService = Get.find<AuthService>();

  final emailController = TextEditingController(text: 'string');
  final passwordController = TextEditingController(text: 'string');

  // Placeholder for login functionality
  Future<void> login() async {
    final AuthService authService = Get.find<AuthService>();

    // Example of using AuthService:
    try {
      final response = await authService.login(
        emailController.text,
        passwordController.text,
      );

      Central.accessToken = response.accessToken;

      Get.toNamed(AppRoutes.chatList);
    } catch (e) {
      if (kDebugMode) {
        print(e.toString());
      }
      Get.showSnackbar(GetSnackBar(title: "Error", message: e.toString()));
    }
  }

  // Placeholder for navigate to register
  void navigateToRegister() {
    Get.toNamed(AppRoutes.register);
  }

  @override
  void onClose() {
    emailController.dispose();
    passwordController.dispose();
    super.onClose();
  }
}
