import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserTokenDto {
    @ApiProperty()
    isEnabled: boolean;
}