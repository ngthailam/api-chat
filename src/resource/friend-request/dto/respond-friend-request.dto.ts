import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class RespondFriendRequestDto {
  @ApiProperty({
    description: 'The response to the friend request',
    enum: ['accept', 'reject'],
    example: 'accept',
  })
  @IsIn(['accept', 'reject'])
  response: 'accept' | 'reject';
}
