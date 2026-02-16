import { Test, TestingModule } from '@nestjs/testing';
import { FriendController } from './friend.controller.js';
import { FriendService } from './friend.service.js';

describe('FriendController', () => {
  let controller: FriendController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendController],
      providers: [FriendService],
    }).compile();

    controller = module.get<FriendController>(FriendController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
