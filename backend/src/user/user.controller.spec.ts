import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    getAllUsers: jest.fn(() => ['user1', 'user2']),
    createUser: jest.fn((dto: CreateUserDto) => ({
      id: '123',
      ...dto,
    })),
    loginUser: jest.fn((iban: string) => ({
      iban: 'GB29XABC1011231236123456780',
    })),
    getUserById: jest.fn((id: string) => ({
      id,
      name: 'John Doe',
      iban: 'GB29XABC1011231236123456780',
    })),
    getUserByIban: jest.fn((iban: string) => ({
      id: '123',
      name: 'John Doe',
      iban,
    })),
    updateUser: jest.fn((id: string, dto: UpdateUserDto) => ({
      id,
      ...dto,
    })),
    deleteUser: jest.fn((id: string) => ({
      id,
      message: 'User deleted successfully',
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('should get all users', async () => {
    const result = await userController.getAllUsers();
    expect(result).toEqual(['user1', 'user2']);
    expect(userService.getAllUsers).toHaveBeenCalled();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      fullName: 'John',
      iban: 'IBAN123',
      currentBalance: 100,
    };
    const result = await userController.createUser(createUserDto);
    expect(result).toEqual({
      id: '123',
      fullName: 'John',
      iban: 'IBAN123',
      currentBalance: 100,
    });
    expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
  });

  it('should login a user', async () => {
    const loginUserDto: LoginUserDto = { iban: 'IBAN123' };
    const result = await userController.loginUser(loginUserDto);
    expect(result).toEqual({ iban: 'GB29XABC1011231236123456780' });
    expect(userService.loginUser).toHaveBeenCalledWith(loginUserDto.iban);
  });

  it('should get user by id', async () => {
    const result = await userController.getUserById('123');
    expect(result).toEqual({
      id: '123',
      name: 'John Doe',
      iban: 'GB29XABC1011231236123456780',
    });
    expect(userService.getUserById).toHaveBeenCalledWith('123');
  });

  it('should get user by iban', async () => {
    const result = await userController.getUserByIban('IBAN123');
    expect(result).toEqual({
      id: '123',
      name: 'John Doe',
      iban: 'IBAN123',
    });
    expect(userService.getUserByIban).toHaveBeenCalledWith('IBAN123');
  });

  it('should update a user', async () => {
    const updateUserDto: UpdateUserDto = { fullName: 'John Updated' };
    const result = await userController.updateUser('123', updateUserDto);
    expect(result).toEqual({
      id: '123',
      fullName: 'John Updated',
    });
    expect(userService.updateUser).toHaveBeenCalledWith('123', updateUserDto);
  });

  it('should delete a user', async () => {
    const result = await userController.deleteUser('123');
    expect(result).toEqual({
      id: '123',
      message: 'User deleted successfully',
    });
    expect(userService.deleteUser).toHaveBeenCalledWith('123');
  });
});
