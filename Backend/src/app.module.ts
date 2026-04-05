import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { ContractsModule } from "./contracts/contracts.module";
import { DocumentsModule } from "./documents/documents.module";
import { PrismaModule } from "./prisma/prisma.module";
import { StorageModule } from "./storage/storage.module";
import { UsersModule } from "./users/users.module";

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    StorageModule,
    ContractsModule,
    DocumentsModule,
  ],
})
export class AppModule {}
