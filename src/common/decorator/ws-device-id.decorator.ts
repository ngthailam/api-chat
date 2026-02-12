import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

export const WsDeviceIdDecorator = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string | undefined => {
    const client = ctx.switchToWs().getClient<Socket>();
    return client.handshake.auth['x-device-id'] as string | undefined;
  },
);