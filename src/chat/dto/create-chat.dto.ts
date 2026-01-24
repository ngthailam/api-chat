import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsEnum, IsNotEmpty } from 'class-validator';
import { ChatType } from './chat-type';

export class CreateChatDto {
  name?: string;

  @ApiProperty()
  @ArrayNotEmpty()
  memberIds: string[];

  @ApiProperty({
    enum: ChatType,
    example: ChatType.ONE_ONE,
  })
  @IsEnum(ChatType)
  type: ChatType;
}
