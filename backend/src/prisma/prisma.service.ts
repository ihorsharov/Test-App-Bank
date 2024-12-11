import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
    this.$connect().catch((error) => {
      console.error('Error connecting to the database:', error);
    });
  }
}
