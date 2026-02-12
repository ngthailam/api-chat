import 'package:demoweb/app/routes/app_routes.dart';
import 'package:demoweb/data/central.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../data/services/api_service.dart';

class LoginBindings extends Bindings {
  @override
  void dependencies() {
    Get.put(LoginController());
  }
}

class LoginController extends GetxController {
  // Get the ApiService from GetX dependency injection
  final ApiService apiService = Get.find<ApiService>();

  final emailController = TextEditingController(text: 'string');
  final passwordController = TextEditingController(text: 'string');

  // Placeholder for login functionality
  Future<void> login() async {
    final ApiService apiService = Get.find<ApiService>();

    // Example of using ApiService:
    try {
      final response = await apiService.login(
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
