import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RegisterUserTokenDto {
    @IsNotEmpty()
    @ApiProperty()
    token: string
}