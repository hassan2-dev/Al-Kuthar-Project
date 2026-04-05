import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { CurrentUser, RequestUser } from "../common/current-user.decorator";
import { DocumentListQuery, DocumentsService } from "./documents.service";

@Controller("documents")
@UseGuards(AuthGuard("jwt"))
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}

  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: 52_428_800 },
    }),
  )
  upload(
    @CurrentUser() user: RequestUser,
    @UploadedFile() file: Express.Multer.File,
    @Body("contractId") bodyContractId?: string,
    @Query("contractId") queryContractId?: string,
  ) {
    const contractId = bodyContractId ?? queryContractId;
    return this.documents.upload(user.userId, file, contractId);
  }

  @Get()
  findAll(
    @Query("q") q?: string,
    @Query("name") name?: string,
    @Query("contractId") contractId?: string,
    @Query("uploadedById") uploadedById?: string,
    @Query("mimeType") mimeType?: string,
    @Query("createdFrom") createdFrom?: string,
    @Query("createdTo") createdTo?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("sortBy") sortBy?: "createdAt" | "originalName" | "size",
    @Query("order") order?: "asc" | "desc",
  ) {
    const filters: DocumentListQuery = {
      q,
      name,
      contractId,
      uploadedById,
      mimeType,
      createdFrom,
      createdTo,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sortBy,
      order,
    };
    return this.documents.findAll(filters);
  }

  @Get(":id/download")
  download(@Param("id") id: string) {
    return this.documents.getDownloadUrl(id);
  }
}
