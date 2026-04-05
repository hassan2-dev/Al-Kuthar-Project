import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser, RequestUser } from "../common/current-user.decorator";
import { ContractsService, ContractListQuery } from "./contracts.service";
import { CreateContractDto } from "./dto/create-contract.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";

@Controller("contracts")
@UseGuards(AuthGuard("jwt"))
export class ContractsController {
  constructor(private readonly contracts: ContractsService) {}

  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateContractDto) {
    return this.contracts.create(user.userId, dto);
  }

  @Get()
  findAll(
    @Query("status") status?: string,
    @Query("seller_name") seller_name?: string,
    @Query("sellerName") sellerName?: string,
    @Query("buyer_name") buyer_name?: string,
    @Query("buyerName") buyerName?: string,
    @Query("type") type?: string,
    @Query("search") search?: string,
    @Query("createdFrom") createdFrom?: string,
    @Query("createdTo") createdTo?: string,
    @Query("updatedFrom") updatedFrom?: string,
    @Query("updatedTo") updatedTo?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("sort") sort?: "createdAt" | "updatedAt",
    @Query("order") order?: "asc" | "desc",
  ) {
    const q: ContractListQuery = {
      status,
      seller: seller_name ?? sellerName,
      buyer: buyer_name ?? buyerName,
      type,
      search,
      createdFrom,
      createdTo,
      updatedFrom,
      updatedTo,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sort,
      order,
    };
    return this.contracts.findAll(q);
  }

  @Get(":id/logs")
  getLogs(@Param("id") id: string) {
    return this.contracts.logsForContract(id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.contracts.findOne(id);
  }

  @Put(":id/confirm")
  confirm(@Param("id") id: string) {
    return this.contracts.confirm(id);
  }

  @Put(":id/revert")
  revert(@Param("id") id: string) {
    return this.contracts.revert(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdateContractDto) {
    return this.contracts.update(id, dto);
  }
}
