import { IsEnum, IsIn, IsOptional } from 'class-validator';
import { ReactionType } from '../model/reaction-type';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMessageDto {
  @ApiPropertyOptional({
    description: 'Reaction type (null to remove reaction)',
    enum: ReactionType,
    nullable: true,
    example: ReactionType.HEART,
  })
  @IsOptional() // ← allows undefined & null
  @IsEnum(ReactionType, {
    message: `reaction must be one of: ${Object.values(ReactionType).join(
      ', ',
    )}`,
  })
  reaction: ReactionType | null;
}
