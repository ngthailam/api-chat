import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { FriendRequest } from './entities/friend-request';
import { Repository } from 'typeorm';
import { CustomException } from 'src/common/errors/exception/custom.exception';
import { CustomErrors } from 'src/common/errors/error_codes';

describe('FriendRequestService', () => {
  let service: FriendRequestService;
  let repository: Repository<FriendRequest>;

  const mockRepository = {
    find: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendRequestService,
        {
          provide: getRepositoryToken(FriendRequest),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FriendRequestService>(FriendRequestService);
    repository = module.get<Repository<FriendRequest>>(
      getRepositoryToken(FriendRequest),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFriendRequest', () => {
    const userId = 'user-123';
    const targetUserId = 'user-456';

    it('should throw BAD_REQUEST when friend request already exists (sender -> receiver)', async () => {
      const existingRequest: Partial<FriendRequest> = {
        id: 1,
        senderId: userId,
        receiverId: targetUserId,
        status: 'pending',
        createdAt: new Date(),
      };

      mockRepository.find.mockResolvedValue([existingRequest]);

      await expect(
        service.createFriendRequest(userId, targetUserId),
      ).rejects.toThrow(new CustomException(CustomErrors.FR_ALREADY_EXIST));

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: [
          { senderId: userId, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: userId },
        ],
      });
    });

    it('should throw BAD_REQUEST when friend request already exists (receiver -> sender)', async () => {
      const existingRequest: Partial<FriendRequest> = {
        id: 1,
        senderId: targetUserId,
        receiverId: userId,
        status: 'pending',
        createdAt: new Date(),
      };

      mockRepository.find.mockResolvedValue([existingRequest]);

      await expect(
        service.createFriendRequest(userId, targetUserId),
      ).rejects.toThrow(new CustomException(CustomErrors.FR_ALREADY_EXIST));

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: [
          { senderId: userId, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: userId },
        ],
      });
    });

    it('should successfully create friend request when no existing request', async () => {
      mockRepository.find.mockResolvedValue([]);

      const savedRequest: Partial<FriendRequest> = {
        id: 1,
        senderId: userId,
        receiverId: targetUserId,
        status: 'pending',
        createdAt: new Date(),
      };

      mockRepository.save.mockResolvedValue(savedRequest);

      const result = await service.createFriendRequest(userId, targetUserId);

      expect(result).toEqual(savedRequest);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: [
          { senderId: userId, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: userId },
        ],
      });
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAllRelatingUser', () => {
    const userId = 'user-123';

    it('should return all friend requests where user is sender or receiver', async () => {
      const requests: Partial<FriendRequest>[] = [
        {
          id: 1,
          senderId: userId,
          receiverId: 'user-456',
          status: 'pending',
          createdAt: new Date(),
        },
        {
          id: 2,
          senderId: 'user-789',
          receiverId: userId,
          status: 'accept',
          createdAt: new Date(),
        },
      ];

      mockRepository.find.mockResolvedValue(requests);

      const result = await service.findAllRelatingUser(userId);

      expect(result).toEqual(requests);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: [{ receiverId: userId }, { senderId: userId }],
      });
    });

    it('should return empty array when no friend requests exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAllRelatingUser(userId);

      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: [{ receiverId: userId }, { senderId: userId }],
      });
    });
  });

  describe('remove', () => {
    const userId = 'user-123';
    const requestId = 1;

    it('should throw NOT_FOUND when request does not exist', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(userId, requestId)).rejects.toThrow(
        new CustomException(CustomErrors.FR_NOT_EXIST),
      );

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: requestId });
    });

    it('should throw BAD_REQUEST when user is not the sender', async () => {
      const request: Partial<FriendRequest> = {
        id: requestId,
        senderId: 'another-user',
        receiverId: userId,
        status: 'pending',
        createdAt: new Date(),
      };

      mockRepository.findOneBy.mockResolvedValue(request);

      await expect(service.remove(userId, requestId)).rejects.toThrow(
        new CustomException(CustomErrors.FR_NOT_OWNER),
      );

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: requestId });
    });

    it('should successfully delete the request when user is sender', async () => {
      const request: Partial<FriendRequest> = {
        id: requestId,
        senderId: userId,
        receiverId: 'user-456',
        status: 'pending',
        createdAt: new Date(),
      };

      mockRepository.findOneBy.mockResolvedValue(request);
      mockRepository.delete.mockResolvedValue({ affected: 1, raw: [] });

      const result = await service.remove(userId, requestId);

      expect(result).toEqual({ affected: 1, raw: [] });
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: requestId });
      expect(mockRepository.delete).toHaveBeenCalledWith({ id: requestId });
    });
  });

  describe('respondToFriendRequest', () => {
    const userId = 'user-123';
    const requestId = 1;

    it('should throw NOT_FOUND when request does not exist', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.respondToFriendRequest(userId, requestId, 'accept'),
      ).rejects.toThrow(new CustomException(CustomErrors.FR_NOT_EXIST));

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: requestId });
    });

    it('should throw BAD_REQUEST when user is not the receiver', async () => {
      const request: Partial<FriendRequest> = {
        id: requestId,
        senderId: 'another-user',
        receiverId: 'user-456',
        status: 'pending',
        createdAt: new Date(),
      };

      mockRepository.findOneBy.mockResolvedValue(request);

      await expect(
        service.respondToFriendRequest(userId, requestId, 'accept'),
      ).rejects.toThrow(new CustomException(CustomErrors.FR_NOT_OWNER));

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: requestId });
    });

    it('should successfully accept the request', async () => {
      const request: Partial<FriendRequest> = {
        id: requestId,
        senderId: 'user-456',
        receiverId: userId,
        status: 'pending',
        createdAt: new Date(),
      };

      const updatedRequest = {
        ...request,
        status: 'accept',
        respondAt: new Date(),
      };

      mockRepository.findOneBy.mockResolvedValue(request);
      mockRepository.save.mockResolvedValue(updatedRequest);

      const result = await service.respondToFriendRequest(
        userId,
        requestId,
        'accept',
      );

      expect(result).toEqual(updatedRequest);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: requestId });
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: requestId,
          status: 'accept',
          respondAt: expect.any(Date),
        }),
      );
    });

    it('should successfully reject the request', async () => {
      const request: Partial<FriendRequest> = {
        id: requestId,
        senderId: 'user-456',
        receiverId: userId,
        status: 'pending',
        createdAt: new Date(),
      };

      const updatedRequest = {
        ...request,
        status: 'reject',
        respondAt: new Date(),
      };

      mockRepository.findOneBy.mockResolvedValue(request);
      mockRepository.save.mockResolvedValue(updatedRequest);

      const result = await service.respondToFriendRequest(
        userId,
        requestId,
        'reject',
      );

      expect(result).toEqual(updatedRequest);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: requestId });
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: requestId,
          status: 'reject',
          respondAt: expect.any(Date),
        }),
      );
    });
  });
});
