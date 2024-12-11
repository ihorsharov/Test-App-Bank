import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const { fullName, iban, currentBalance } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({ where: { iban } });
    if (existingUser) {
      throw new BadRequestException('User with this IBAN already exists');
    }

    return this.prisma.user.create({
      data: { fullName, iban, currentBalance },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserByIban(iban: string) {
    const user = await this.prisma.user.findUnique({ where: { iban } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
    });
  }

  async loginUser(iban: string) {
    const user = await this.prisma.user.findUnique({ where: { iban } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async deleteUser(userId: string) {
    return this.prisma.user.delete({ where: { id: userId } });
  }
}
