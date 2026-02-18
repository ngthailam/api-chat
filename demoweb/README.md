# demoweb

A new Flutter project.

## Environment Configuration

This app supports two environments:
- **Development**: Uses `http://localhost:3000/`
- **Production**: Uses `https://api-chat-ssve.onrender.com/`

The environment is configured using the `--dart-define` flag with the `ENVIRONMENT` variable.

### Running the App

#### Development Environment
```bash
flutter run --dart-define=ENVIRONMENT=development
```

Or using the default (development):
```bash
flutter run
```

#### Production Environment
```bash
flutter run --dart-define=ENVIRONMENT=production
```

#### Build for Production
```bash
flutter build web --dart-define=ENVIRONMENT=production
```

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.

