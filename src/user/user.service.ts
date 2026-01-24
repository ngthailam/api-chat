import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repo.findOne({
      where: {
        email: ILike(`%${email}%`),
      },
    });

    if (!user) {
      throw new HttpException(
        `Cannot find user with email ${email}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
