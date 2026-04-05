import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateContractDto } from "./dto/create-contract.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";

export type ContractListQuery = {
  status?: string;
  seller?: string;
  buyer?: string;
  type?: string;
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
  constructor(private readonly prisma: PrismaService) {}

  private normalizeNames(dto: CreateContractDto | UpdateContractDto) {
    return {
      sellerName: dto.seller_name ?? dto.sellerName,
      buyerName: dto.buyer_name ?? dto.buyerName,
      type: dto.type,
    };
  }

  async create(ownerId: string, dto: CreateContractDto) {
    const n = this.normalizeNames(dto);
    return this.prisma.contract.create({
      data: {
        sellerName: n.sellerName,
        buyerName: n.buyerName,
        type: n.type,
        ownerId,
        status: "draft",
      },
    });
  }

  async findAll(q: ContractListQuery) {
    const page = Math.max(1, q.page ?? 1);
    const limit = Math.min(100, Math.max(1, q.limit ?? 50));
    const where: Prisma.ContractWhereInput = {};

    if (q.status) where.status = q.status;
    if (q.type) where.type = q.type;
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

    const updated = await this.prisma.$transaction(async (tx) => {
      const c = await tx.contract.update({ where: { id }, data });
      if (logs.length) {
        await tx.contractLog.createMany({ data: logs });
      }
      return c;
    });

    return updated;
  }

  async confirm(id: string) {
    const existing = await this.prisma.contract.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("العقد غير موجود");
    }
    const oldStatus = existing.status;
    return this.prisma.$transaction(async (tx) => {
      const c = await tx.contract.update({
        where: { id },
        data: { status: "confirmed" },
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
}
