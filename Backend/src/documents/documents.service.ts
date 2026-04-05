import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { StorageService } from "../storage/storage.service";

export type DocumentListQuery = {
  q?: string;
  name?: string;
  contractId?: string;
  uploadedById?: string;
  mimeType?: string;
  createdFrom?: string;
  createdTo?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "originalName" | "size";
  order?: "asc" | "desc";
};

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async upload(
    userId: string,
    file: Express.Multer.File | undefined,
    contractId?: string,
  ) {
    if (!file?.buffer?.length) {
      throw new BadRequestException("الملف مطلوب");
    }
    if (contractId) {
      const c = await this.prisma.contract.findUnique({
        where: { id: contractId },
      });
      if (!c) {
        throw new NotFoundException("العقد غير موجود");
      }
    }

    this.storage.assertConfigured();
    const key = this.storage.buildObjectKey(userId, file.originalname);
    await this.storage.putObject(key, file.buffer, file.mimetype);

    return this.prisma.document.create({
      data: {
        originalName: file.originalname,
        storageKey: key,
        mimeType: file.mimetype,
        size: file.size,
        contractId: contractId ?? null,
        uploadedById: userId,
      },
    });
  }

  async findAll(q: DocumentListQuery) {
    const page = Math.max(1, q.page ?? 1);
    const limit = Math.min(100, Math.max(1, q.limit ?? 50));
    const nameSearch = q.q ?? q.name;

    const where: Prisma.DocumentWhereInput = {};
    if (nameSearch) {
      where.originalName = { contains: nameSearch };
    }
    if (q.contractId) where.contractId = q.contractId;
    if (q.uploadedById) where.uploadedById = q.uploadedById;
    if (q.mimeType) where.mimeType = q.mimeType;
    if (q.createdFrom || q.createdTo) {
      where.createdAt = {};
      if (q.createdFrom) where.createdAt.gte = new Date(q.createdFrom);
      if (q.createdTo) where.createdAt.lte = new Date(q.createdTo);
    }

    const sortField =
      q.sortBy === "originalName"
        ? "originalName"
        : q.sortBy === "size"
          ? "size"
          : "createdAt";
    const order = q.order === "asc" ? "asc" : "desc";

    const [items, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        orderBy: { [sortField]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.document.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async getDownloadUrl(id: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) {
      throw new NotFoundException("المستند غير موجود");
    }
    const url = await this.storage.getDownloadUrl(doc.storageKey);
    return {
      url,
      document: {
        id: doc.id,
        originalName: doc.originalName,
        mimeType: doc.mimeType,
        size: doc.size,
        contractId: doc.contractId,
        createdAt: doc.createdAt,
      },
    };
  }
}
