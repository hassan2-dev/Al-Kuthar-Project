import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { StorageService } from "../storage/storage.service";
import { CreateContractDto } from "./dto/create-contract.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";

export type ContractListQuery = {
  status?: string;
  seller?: string;
  buyer?: string;
  type?: string;
  archived?: "true" | "false";
  createdBy?: string;
  confirmedBy?: string;
  search?: string;
  createdFrom?: string;
  createdTo?: string;
  updatedFrom?: string;
  updatedTo?: string;
  page?: number;
  limit?: number;
  sort?: "createdAt" | "updatedAt";
  order?: "asc" | "desc";
};

@Injectable()
export class ContractsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  private normalizeNames(dto: CreateContractDto | UpdateContractDto) {
    return {
      sellerName: dto.seller_name ?? dto.sellerName,
      buyerName: dto.buyer_name ?? dto.buyerName,
      type: dto.type,
      details: dto.details,
      contractDate: dto.contractDate,
    };
  }

  async create(ownerId: string, dto: CreateContractDto) {
    const n = this.normalizeNames(dto);
    return this.prisma.contract.create({
      data: {
        sellerName: n.sellerName,
        buyerName: n.buyerName,
        type: n.type,
        details: n.details as Prisma.InputJsonValue | undefined,
        contractDate: n.contractDate ? new Date(n.contractDate) : undefined,
        ownerId,
        createdById: ownerId,
        status: "draft",
      },
    });
  }

  async findAll(q: ContractListQuery, userId?: string) {
    const page = Math.max(1, q.page ?? 1);
    const limit = Math.min(100, Math.max(1, q.limit ?? 50));
    const where: Prisma.ContractWhereInput = {};

    if (q.status) where.status = q.status;
    if (q.type) where.type = q.type;
    if (q.archived === "true") where.isArchived = true;
    if (q.archived === "false") where.isArchived = false;
    if (q.createdBy === "me" && userId) where.createdById = userId;
    if (q.confirmedBy === "me" && userId) where.confirmedById = userId;
    if (q.createdBy && q.createdBy !== "me") where.createdById = q.createdBy;
    if (q.confirmedBy && q.confirmedBy !== "me") where.confirmedById = q.confirmedBy;
    if (q.seller) {
      where.sellerName = { contains: q.seller };
    }
    if (q.buyer) {
      where.buyerName = { contains: q.buyer };
    }
    if (q.search) {
      where.OR = [
        { sellerName: { contains: q.search } },
        { buyerName: { contains: q.search } },
        { type: { contains: q.search } },
      ];
    }
    if (q.createdFrom || q.createdTo) {
      where.createdAt = {};
      if (q.createdFrom) where.createdAt.gte = new Date(q.createdFrom);
      if (q.createdTo) where.createdAt.lte = new Date(q.createdTo);
    }
    if (q.updatedFrom || q.updatedTo) {
      where.updatedAt = {};
      if (q.updatedFrom) where.updatedAt.gte = new Date(q.updatedFrom);
      if (q.updatedTo) where.updatedAt.lte = new Date(q.updatedTo);
    }

    const sortField = q.sort === "updatedAt" ? "updatedAt" : "createdAt";
    const order = q.order === "asc" ? "asc" : "desc";

    const [items, total] = await Promise.all([
      this.prisma.contract.findMany({
        where,
        orderBy: { [sortField]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.contract.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const contract = await this.prisma.contract.findUnique({ where: { id } });
    if (!contract) {
      throw new NotFoundException("العقد غير موجود");
    }
    return contract;
  }

  async update(id: string, dto: UpdateContractDto) {
    const existing = await this.prisma.contract.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("العقد غير موجود");
    }
    const n = this.normalizeNames(dto);
    const logs: Prisma.ContractLogCreateManyInput[] = [];

    if (n.sellerName !== undefined && n.sellerName !== existing.sellerName) {
      logs.push({
        contractId: id,
        action: "seller_name_updated",
        fromValue: existing.sellerName ?? "",
        toValue: n.sellerName ?? "",
      });
    }
    if (n.buyerName !== undefined && n.buyerName !== existing.buyerName) {
      logs.push({
        contractId: id,
        action: "buyer_name_updated",
        fromValue: existing.buyerName ?? "",
        toValue: n.buyerName ?? "",
      });
    }

    const data: Prisma.ContractUpdateInput = {};
    if (n.sellerName !== undefined) data.sellerName = n.sellerName;
    if (n.buyerName !== undefined) data.buyerName = n.buyerName;
    if (n.type !== undefined) data.type = n.type;
    if (n.details !== undefined) data.details = n.details as Prisma.InputJsonValue;
    if (n.contractDate !== undefined) {
      data.contractDate = n.contractDate ? new Date(n.contractDate) : null;
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const c = await tx.contract.update({ where: { id }, data });
      if (logs.length) {
        await tx.contractLog.createMany({ data: logs });
      }
      return c;
    });

    return updated;
  }

  async confirm(id: string, userId?: string) {
    const existing = await this.prisma.contract.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("العقد غير موجود");
    }
    const oldStatus = existing.status;
    return this.prisma.$transaction(async (tx) => {
      const c = await tx.contract.update({
        where: { id },
        data: { status: "confirmed", confirmedById: userId ?? existing.confirmedById },
      });
      await tx.contractLog.create({
        data: {
          contractId: id,
          action: "status_changed",
          fromValue: oldStatus,
          toValue: "confirmed",
        },
      });
      return c;
    });
  }

  async revert(id: string) {
    const existing = await this.prisma.contract.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("العقد غير موجود");
    }
    const oldStatus = existing.status;
    return this.prisma.$transaction(async (tx) => {
      const c = await tx.contract.update({
        where: { id },
        data: { status: "draft" },
      });
      await tx.contractLog.create({
        data: {
          contractId: id,
          action: "status_changed",
          fromValue: oldStatus,
          toValue: "draft",
        },
      });
      return c;
    });
  }

  async logsForContract(contractId: string) {
    await this.findOne(contractId);
    return this.prisma.contractLog.findMany({
      where: { contractId },
      orderBy: { createdAt: "asc" },
    });
  }

  async archive(id: string) {
    await this.findOne(id);
    return this.prisma.contract.update({
      where: { id },
      data: { isArchived: true, archivedAt: new Date() },
    });
  }

  async unarchive(id: string) {
    await this.findOne(id);
    return this.prisma.contract.update({
      where: { id },
      data: { isArchived: false, archivedAt: null },
    });
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const docs = await tx.document.findMany({
        where: { contractId: id },
        select: { id: true, storageKey: true },
      });
      for (const doc of docs) {
        const key = doc.storageKey?.trim();
        if (key) {
          await this.storage.deleteObject(key);
        }
      }
      await tx.document.deleteMany({ where: { contractId: id } });
      await tx.contractLog.deleteMany({ where: { contractId: id } });
      const contractResult = await tx.contract.deleteMany({ where: { id } });
      return {
        ok: true,
        removedDocuments: docs.length,
        contractRemoved: contractResult.count > 0,
      };
    });
  }
}
