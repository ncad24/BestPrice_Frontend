import {inject, Injectable} from '@angular/core';
import {environment} from '../environments/enviroment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Category} from '../model/category';
import {Product} from '../model/product';
import {SupermarketProductPricesDto} from '../model/supermarket-product-prices-dto';
import {PricesByProductSupermarket} from '../model/prices-by-product-supermarket';
import {ListproductsbysupermarketDto} from '../model/listproductsbysupermarket-dto';
import {ProductsByUser} from '../model/products-by-user';
import {ProductpriceDto} from '../model/productprice-dto';
import {Productsbysupermarket} from '../model/productsbysupermarket';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url = environment.apiUrl
  private http: HttpClient = inject(HttpClient);
  private productList: Subject<Product[]> = new Subject<Product[]>();
  constructor() { }

  list(): Observable<any> {
    return this.http.get<Product[]>(this.url + "/products");
  }
  listId(id: number): Observable<any>{
    return this.http.get<Product[]>(this.url + '/product/id/' + id);
  }
  insert(product: FormData): Observable<any>{
    return this.http.post(this.url + '/product', product);
  }
  update(product: Product): Observable<any>{
    return this.http.put(this.url + '/product/update', product);
  }
  delete(id: number) {
    return this.http.delete(this.url + '/product/delete/' + id);
  }
  getProductsByName(productName: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/products/searchName`, { params: { productName } });
  }

  assignToSupermarket(productId: number, supermarketId: number, price: number) {
    return this.http.post(this.url + '/product/supermarket/' + productId + '/' + supermarketId + '/'+price, {});
  }
  unassignToSupermarket(productId: number, supermarketId: number){
    return this.http.delete(this.url + '/product/supermarket/' + productId + '/'+supermarketId);
  }
  updateProductPrice(productId: number, supermarketId: number, price: number) {
    return this.http.put(this.url + '/product/supermarket/'+productId+'/'+supermarketId + '/'+price, {});
  }
  getProductsBySupermarket(supermarketId: number) {
    return this.http.get<ListproductsbysupermarketDto[]>(this.url+'/products/supermarkets/'+supermarketId);
  }
  getTop5LowestPriceProducts(){
    return this.http.get<ProductpriceDto[]>(`${this.url}/top5-lowest-price`);
  }
  getProductsBySupermarketByProductName(supermarketId: number, productName: string){
    return this.http.get<ListproductsbysupermarketDto[]>(this.url+'/products/supermarkets/'+supermarketId+'/'+productName);
  }
  getProductsByFilter(
    productName: string,
    brandName?: string,
    categoryName?: string,
    minPrice?: number,
    maxPrice?: number,
    supermarketName?: string,
    sortOption?: string
  ): Observable<SupermarketProductPricesDto[]> {
    let params = new HttpParams();

    if (productName) params = params.set('productName', productName);
    if (brandName) params = params.set('brandName', brandName);
    if (categoryName) params = params.set('categoryName', categoryName);
    if (minPrice != null) params = params.set('minPrice', minPrice.toString());
    if (maxPrice != null) params = params.set('maxPrice', maxPrice.toString());
    if (supermarketName) params = params.set('supermarketName', supermarketName);
    if (sortOption) params = params.set('sortOption', sortOption);

    return this.http.get<SupermarketProductPricesDto[]>(this.url + '/products/supermarkets/filter', { params });
  }

  getPricesByProductSupermarket(productID: number): Observable<PricesByProductSupermarket[]> {
    return this.http.get<PricesByProductSupermarket[]>(`${this.url}/products/supermarkets/prices`, {
      params: { productID: productID.toString() }
    });
  }

  getProductsByUserId(userId: number): Observable<ProductsByUser[]> {
    return this.http.get<ProductsByUser[]>(`${this.url}/${userId}`);
  }

  setList(newList: Product[]): void{
    this.productList.next(newList);
  }
  getList() : Observable<Product[]>{
    return this.productList.asObservable();
  }
  countProductsBySupermarket(): Observable<any>{
    return this.http.get<Productsbysupermarket>(`${this.url}/products/count`, {});
  }
}
