import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty } from "class-validator";

export class CreateChatDto {
    @ApiProperty()
    @ArrayNotEmpty()
    memberIds: string[];
}
