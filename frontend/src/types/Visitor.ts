import type { Exhibition } from "./Exhibition";
import type { Product } from "./Product";

export interface Visitor {
  id?: number;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  exhibitionId: number;
  productIds: number[];
  exhibition?: Exhibition;
  visitorProducts?: { id: number; product: Product }[];
}
