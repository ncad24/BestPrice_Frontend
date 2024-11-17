import {Product} from './product';
import {UserApp} from './user-app';

export class ProductsByUser {
  userApp: UserApp;
  product: Product;
  date: Date = new Date();
}
