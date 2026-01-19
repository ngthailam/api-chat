import { IsNotEmpty } from 'class-validator';
import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Lam' })
  name: string;

toUser() {
    const user = new User();
    user.name = this.name;
    return user;
  }
}
