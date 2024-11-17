import {Brand} from './brand';
import {Category} from './category';

export class Product {
  productId: number;
  name: String;
  description: String;
  advertisement: String;
  imagePath: String;
  brand: Brand;
  category: Category;
}
