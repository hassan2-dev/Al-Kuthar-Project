import { IsDateString, IsObject, IsOptional, IsString } from "class-validator";

export class CreateContractDto {
  @IsOptional()
  @IsString()
  seller_name?: string;

  @IsOptional()
  @IsString()
  sellerName?: string;

  @IsOptional()
  @IsString()
  buyer_name?: string;

  @IsOptional()
  @IsString()
  buyerName?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;

  @IsOptional()
  @IsDateString()
  contractDate?: string;
}
