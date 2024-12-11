import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransferTransactionDto } from './dto/transfer-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('opeartion')
  async operation(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.operation(createTransactionDto);
  }

  @Post('transfer')
  async transfer(@Body() transferDto: TransferTransactionDto) {
    return this.transactionService.transfer(transferDto);
  }

  @Get('statistic/:userId')
  async statement(@Param('userId') userId: string) {
    return this.transactionService.getStats(userId);
  }
}
