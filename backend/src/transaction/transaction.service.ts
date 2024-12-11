import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionCategory } from '@prisma/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransferTransactionDto } from './dto/transfer-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async operation(createTransactionDto: CreateTransactionDto) {
    const { userId, category, amount } = createTransactionDto;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    if (
      category === TransactionCategory.WITHDRAW &&
      user.currentBalance < amount
    ) {
      throw new BadRequestException('Operation deprecated. Not enough money');
    }

    let resultingBalance: number;
    if (category === TransactionCategory.DEPOSIT) {
      resultingBalance = user.currentBalance + amount;
    } else if (category === TransactionCategory.WITHDRAW) {
      resultingBalance = user.currentBalance - amount;
    } else {
      throw new BadRequestException('Such category does not exist');
    }

    await this.prisma.transaction.create({
      data: {
        userId,
        category,
        amount: category === TransactionCategory.DEPOSIT ? amount : -amount,
        resultingBalance,
      },
    });

    return this.prisma.user.update({
      where: { id: userId },
      data: { currentBalance: resultingBalance },
    });
  }

  async transfer(transferDto: TransferTransactionDto) {
    const { senderId, receiverIban, amount } = transferDto;
    const sender = await this.prisma.user.findUnique({
      where: { id: senderId },
    });
    if (!sender) throw new BadRequestException('Sender not found');
    if (sender.currentBalance < amount)
      throw new BadRequestException('Operation deprecated. Not enough money');

    const receiver = await this.prisma.user.findUnique({
      where: { iban: receiverIban },
    });
    if (!receiver) throw new BadRequestException('Receiver not found');

    const senderNewBalance = sender.currentBalance - amount;
    const receiverNewBalance = receiver.currentBalance + amount;

    await this.prisma.transaction.createMany({
      data: [
        {
          userId: senderId,
          category: TransactionCategory.TRANSFER,
          amount: -amount,
          resultingBalance: senderNewBalance,
        },
        {
          userId: receiver.id,
          category: TransactionCategory.TRANSFER,
          amount,
          resultingBalance: receiverNewBalance,
        },
      ],
    });

    await this.prisma.user.update({
      where: { id: senderId },
      data: { currentBalance: senderNewBalance },
    });

    await this.prisma.user.update({
      where: { id: receiver.id },
      data: { currentBalance: receiverNewBalance },
    });
  }

  async getStats(userId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return transactions;
  }
}
