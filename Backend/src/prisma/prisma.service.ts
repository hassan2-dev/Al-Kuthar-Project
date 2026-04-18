import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    if (!process.env.DATABASE_URL?.trim()) {
      throw new Error(
        "DATABASE_URL is not set. Configure it in the deployment environment (e.g. Coolify secrets), not only in a local .env file.",
      );
    }
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
