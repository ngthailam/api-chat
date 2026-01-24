import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'app/bindings/dependency_injection.dart';
import 'app/routes/app_routes.dart';
import 'ui/auth/login/login_page.dart';

void main() {
  // Initialize dependency injection before running the app
  DependencyInjection.init();

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'Chat App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      initialRoute: AppRoutes.login,
      getPages: AppRoutes.routes,
      home: const LoginPage(),
    );
  }
}
