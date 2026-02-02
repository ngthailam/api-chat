import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class DeviceIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const deviceId = req.headers['x-device-id'];
    req.deviceId = deviceId;
    return true;
  }
}