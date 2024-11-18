import {Component, inject, ViewChild} from '@angular/core';
import {Product} from '../../../model/product';
import {
  MatCell,
  MatColumnDef, MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatRow,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {ProductService} from '../../../services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatFormField} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {DecimalPipe, NgForOf, NgIf} from '@angular/common';
import {SupermarketProductPricesDto} from '../../../model/supermarket-product-prices-dto';
import {CategoryService} from '../../../services/category.service';
import {BrandService} from '../../../services/brand.service';
import {SupermarketService} from '../../../services/supermarket.service';
import {Brand} from '../../../model/brand';
import {Category} from '../../../model/category';
import {Supermarket} from '../../../model/supermarket';
import Swal from 'sweetalert2';
import {UserInfoDto} from '../../../model/user-info-dto';
import {UserAppService} from '../../../services/user-app.service';
import {OverlayService} from '../../../services/overlay.service';
import {ProductclickService} from '../../../services/productclick.service';
import {photosLink} from '../../forphotoslink/photoslink';

@Component({
  selector: 'app-search-product',
  standalone: true,
  imports: [
    MatHeaderRow,
    MatRow,
    MatPaginator,
    MatFormField,
    MatTable,
    MatHeaderCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    FormsModule,
    NgForOf,
    NgIf,
    DecimalPipe
  ],
  templateUrl: './search-product.component.html',
  styleUrl: './search-product.component.css'
})
export class SearchProductComponent {
  private url = photosLink.apiUrl;
  productName: string = '';
  brandName: string = '';
  categoryName: string = '';
  minPrice: number | null = 0;
  maxPrice: number | null = null;
  supermarketName: string = '';
  sortOption: string = '';
  products: any[] = [];
  brands: any[] = [];
  categories: any[] = [];
  supermarkets: any[] = [];
  hoverProduct: boolean;
  productService: ProductService = inject(ProductService);
  categoryService: CategoryService = inject(CategoryService);
  brandService: BrandService = inject(BrandService);
  supermarketService: SupermarketService = inject(SupermarketService);
  userAppService: UserAppService = inject(UserAppService);
  private overlayService: OverlayService = inject(OverlayService);
  productClickService: ProductclickService = inject(ProductclickService);
  route: Router = inject(Router);
  router: ActivatedRoute = inject(ActivatedRoute);
  isDropdownOpen = false;
  username: string = '';
  userInfo: UserInfoDto | null = null;
  private dialog: MatDialog =  inject(MatDialog);

  ngOnInit(): void {
    this.brandService.list().subscribe({
      next: (data: Brand[]) => {
        console.log("Lista de marcas traída:", data);
        this.brands = data.map((brand) => ({ id: brand.brandId, name: brand.name }));
      },
      error: (error: any) => {
        console.error("Error al cargar marcas:", error);
      }
    });

    // Cargar categorías
    this.categoryService.list().subscribe({
      next: (data: Category[]) => {
        console.log("Lista de categorías traída:", data);
        this.categories = data.map((category) => ({ id: category.categoryId, name: category.name }));
      },
      error: (error: any) => {
        console.error("Error al cargar categorías:", error);
      }
    });

    // Cargar supermercados
    this.supermarketService.list().subscribe({
      next: (data: Supermarket[]) => {
        console.log("Lista de supermercados traída:", data);
        this.supermarkets = data.map((supermarket) => ({ id: supermarket.supermarketId, name: supermarket.name }));
      },
      error: (error: any) => {
        console.error("Error al cargar supermercados:", error);
      }
    });

    this.username = localStorage.getItem('username') || '';

    if (this.username) {
      this.loadUserInfo(this.username);
    }

    this.router.queryParams.subscribe(params => {
      this.productName = params['productName'] || '';
      this.categoryName = params['categoryName'] || '';
      if (this.productName || this.categoryName) {
        this.getProductsByFilter();
      }
    });
  }

  loadUserInfo(username: string) {
    this.userAppService.getUserByUsername(username).subscribe({
      next: (user) => {
        this.userInfo = user;
        console.log('User Info:', this.userInfo);
      },
      error: (err) => {
        console.error('Error fetching user info:', err);
      }
    });
  }

  navigateToHome(): void {
    this.route.navigate(['/home']);
  }


  getProducts(): void {
    this.productService.list().subscribe((data: any) => {
      this.products = data;
    });
  }

  getProductsByFilter() {
    // Validar que minPrice y maxPrice no sean negativos
    if (this.minPrice !== null && this.minPrice < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El precio mínimo no puede ser negativo.',
        confirmButtonText: 'Aceptar'
      });
      return; // Salir de la función si la validación falla
    }

    if (this.maxPrice !== null && this.maxPrice < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El precio máximo no puede ser negativo.',
        confirmButtonText: 'Aceptar'
      });
      return; // Salir de la función si la validación falla
    }

    // Validar que minPrice sea menor que maxPrice
    if (this.minPrice !== null && this.maxPrice !== null && this.minPrice >= this.maxPrice) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El precio mínimo debe ser menor que el precio máximo.',
        confirmButtonText: 'Aceptar'
      });
      return; // Salir de la función si la validación falla
    }
    console.log({
      productName: this.productName,
      brandName: this.brandName,
      categoryName: this.categoryName,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      supermarketName: this.supermarketName,
      sortOption: this.sortOption
    });
    this.route.navigate([], {
      relativeTo: this.router,
      queryParams: {
        productName: this.productName,
        brandName: this.brandName,
        categoryName: this.categoryName,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
        supermarketName: this.supermarketName,
        sortOption: this.sortOption
      },
      queryParamsHandling: 'merge' // Esto mantiene otros parámetros de consulta
    });
    this.productService
      .getProductsByFilter(
        this.productName,
        this.brandName,
        this.categoryName,
        this.minPrice ?? undefined,
        this.maxPrice ?? undefined,
        this.supermarketName,
        this.sortOption
      )
      .subscribe((products: SupermarketProductPricesDto[]) => {
        this.products = products;

        if (this.sortOption === 'lowest') {
          this.products.sort((a, b) => a.productPrice - b.productPrice);
        } else if (this.sortOption === 'highest') {
          this.products.sort((a, b) => b.productPrice - a.productPrice);
        }
      });
  }

  getImageUrl(imagePath: string): string {
    return `http://localhost:8080/images/product/${imagePath}`;
  }

  validatePrice(): void {
    if (this.minPrice !== null && this.minPrice < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El precio mínimo no puede ser negativo.',
        confirmButtonText: 'Aceptar'
      });
      this.minPrice = 0; // Restablece a 0 si se intenta ingresar un número negativo
    }

    if (this.maxPrice !== null && this.maxPrice < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El precio máximo no puede ser negativo.',
        confirmButtonText: 'Aceptar'
      });
      this.maxPrice = 0; // Restablece a 0 si se intenta ingresar un número negativo
    }

    // Asegurarse de que minPrice sea menor que maxPrice
    if (this.minPrice !== null && this.maxPrice !== null && this.minPrice >= this.maxPrice) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El precio mínimo debe ser menor que el precio máximo.',
        confirmButtonText: 'Aceptar'
      });
    }
  }
  goToProductDetail(product: SupermarketProductPricesDto): void {
    this.productClickService.incrementClick(product.productId).subscribe({
      next: () => {
        console.log(`Click incrementado para el producto con ID ${product.productId}`);
        // Luego de incrementar el contador, abrir el overlay con los detalles del producto
        this.overlayService.openProductView(product.productId);
      },
      error: (err) => {
        console.error('Error al incrementar el contador de clics:', err);
        // Incluso si falla, abrir el overlay con los detalles del producto
        this.overlayService.openProductView(product.productId);
      }
    });
  }

  getUserImageUrl(imagePath: String): String {
    return `${this.url}/images/user/${imagePath}`;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  navigateTo(route: string) {
    this.isDropdownOpen = false;
    // Implement navigation logic here
    this.route.navigate([`${route}`]);
  }
  logout() {
    console.log('Cerrando sesión...');
    localStorage.removeItem('authToken');
    this.route.navigate(['']);
  }
}
