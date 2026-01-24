import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

export function WsCurrentUser(
  data?: unknown,
  context?: ExecutionContext,
): { userId: string; username: string } | undefined {
  const ctx = context || context;
  const client: Socket = ctx.switchToWs().getClient<Socket>();
  return client.data?.user;
}

// Create the param decorator
export const WsCurrentUserDecorator = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const client: Socket = ctx.switchToWs().getClient<Socket>();
    const tokenPayload = client.data?.user;

    return {
      'userId' : tokenPayload.sub,
    }
  },
);
