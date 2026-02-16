import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { configConstants } from '../constants/config.constants.js';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const token = this.extractTokenFromHandshake(client);

      if (!token) {
        throw new WsException('Unauthorized: No token provided');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: configConstants.jwtSecret,
      });

      // Attach user to the client for later use
      client.data.user = payload;

      return true;
    } catch (error) {
      throw new WsException('Unauthorized: Invalid token');
    }
  }

  private extractTokenFromHandshake(client: Socket): string | null {
    // Try to get token from auth property (Socket.io v3+)
    if (client.handshake.auth?.token) {
      return client.handshake.auth.token;
    }

    // Try to get token from query parameter
    if (client.handshake.query?.token) {
      return client.handshake.query.token as string;
    }

    // Try to get token from authorization header (for older Socket.io versions)
    const authHeader = client.handshake.auth?.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return null;
  }
}
