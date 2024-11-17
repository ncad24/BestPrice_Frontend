import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {SupermarketProductPricesDto} from '../../../model/supermarket-product-prices-dto';
import {ActivatedRoute} from '@angular/router';
import {ProductService} from '../../../services/product.service';
import {PricesByProductSupermarket} from '../../../model/prices-by-product-supermarket';
import {CurrencyPipe, DecimalPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {Product} from '../../../model/product';
import {ProductclickService} from '../../../services/productclick.service';
import {UserList} from '../../../model/user-list';
import {UserAppService} from '../../../services/user-app.service';
import {ProductPerUserDto} from '../../../model/product-per-user-dto';

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgForOf,
    NgIf,
    DecimalPipe,
    NgClass
  ],
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.css'
})
export class ProductViewComponent {
  product: Product| null = null;
  supermarketPrices: PricesByProductSupermarket[] = [];
  productName: string = '';
  brandName: string = '';
  categoryName: string = '';
  minPrice: number | null = 0;
  maxPrice: number | null = null;
  supermarketName: string = '';
  sortOption: string = '';
  userLists: UserList[] = [];
  productImagesMap: { [listId: number]: ProductPerUserDto[] } = {};
  selectedListId: number | null = null;
  showPopup = false;
  @Input() closePopup!: () => void;
  @Input() productId!: number;

  private route: ActivatedRoute = inject(ActivatedRoute);
  private productService: ProductService = inject(ProductService);
  private userAppService: UserAppService = inject(UserAppService);

  constructor() {}

  ngOnInit(): void {
    //const productId = +this.route.snapshot.paramMap.get('id')!;
    this.productService.listId(this.productId).subscribe({
      next: (product) => {
        this.product = product;
        this.loadSupermarketPrices(this.productId);
      },
      error: (error) => {
        console.error("Error al cargar detalles del producto:", error);
      }
    });
  }

  onClose(): void {
    if (this.closePopup) {
      this.closePopup(); // Ahora debería funcionar correctamente
    }
  }

  loadProductDetails(productId: number): void {
    this.productService.listId(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.loadSupermarketPrices(productId);
      },
      error: (error) => {
        console.error("Error al cargar detalles del producto:", error);
      }
    });
  }

  loadSupermarketPrices(productID: number): void {
    this.productService.getPricesByProductSupermarket(productID).subscribe((data) => {
      this.supermarketPrices = data;
      this.supermarketPrices.sort((a, b) => a.productPrice - b.productPrice)
    });
  }

  // Abrir el popup y cargar listas de usuario
  openAddToListPopup(): void {
    this.userAppService.getUserLists().subscribe({
      next: (lists) => {
        this.userLists = lists;
        this.showPopup = true;
        this.userLists.forEach((list) =>{
          this.loadProducts(list.listId)
        });
      },
      error: (err) => console.error('Error loading user lists:', err),
    });
  }

  // Cerrar el popup
  closeAddToListPopup(): void {
    this.showPopup = false;
  }


  // Añadir el producto a la lista seleccionada
  addProductToList(listId: number): void {
    if (this.product) {
      this.userAppService.assignProductToList(listId, this.product.productId).subscribe({
        next: () => {
          alert('Producto añadido a la lista con éxito.');
          this.closeAddToListPopup();
        },
        error: (err) => console.error('Error adding product to list:', err),
      });
    }
  }

  loadProducts(idListProduct: number): void {
    console.log('selectedListId:', idListProduct);
    if (idListProduct) {
      this.userAppService.getProductsFromList(idListProduct).subscribe({
        next: (list: ProductPerUserDto[]) => {
          this.productImagesMap[idListProduct] = list;
          console.log(this.productImagesMap)
        },
        error: (err) => {
          console.error('Error cargando los productos de la lista:', err);
        }
      });
    }
  }

  getImageUrl(imagePath: String): String {
    return `http://localhost:8080/images/product/${imagePath}`;
  }
  getImageSupermarketUrl(imagePath: string): string {
    return `http://localhost:8080/images/supermarket/${imagePath}`;
  }
  getImagesForList(listId: number): ProductPerUserDto[] {
    return this.productImagesMap[listId]?.slice(0, 4) || [];
  }
}
