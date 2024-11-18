import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CategoryService} from '../../../services/category.service';
import {DecimalPipe, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {SupermarketProductPricesDto} from '../../../model/supermarket-product-prices-dto';
import {Category} from '../../../model/category';
import {ProductService} from '../../../services/product.service';
import {UserAppService} from '../../../services/user-app.service';
import {UserInfoDto} from '../../../model/user-info-dto';
import {ProductclickService} from '../../../services/productclick.service';
import {OverlayService} from '../../../services/overlay.service';
import {photosLink} from '../../forphotoslink/photoslink';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    SlicePipe,
    NgIf,
    DecimalPipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private url: string = photosLink.apiUrl;
  productName: string = '';
  route: Router = inject(Router);
  categoryService: CategoryService = inject(CategoryService);
  productService: ProductService = inject(ProductService);
  userAppService: UserAppService = inject(UserAppService);
  productClickService: ProductclickService = inject(ProductclickService);
  private overlayService: OverlayService = inject(OverlayService)

  categories: any[] = [];
  products: any[] = [];
  username: string = '';
  userInfo: UserInfoDto | null = null;
  productsByCategory: { [categoryName: string]: any[] } = {};
  hoverProduct: boolean;
  isDropdownOpen = false;

  @ViewChild('navContainer', { static: true }) navContainer!: ElementRef;

  ngOnInit(): void {
    this.getCategories();
    this.username = localStorage.getItem('username') || '';

    if (this.username) {
      this.loadUserInfo(this.username);
    }
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

  searchProducts(): void {
    if (this.productName) {
      // Navega a la ruta de búsqueda y pasa el valor de búsqueda en la URL
      this.route.navigate(['/search'], { queryParams: { productName: this.productName } });
    }
  }
  getCategories(): void {
    this.categoryService.list().subscribe((data: any) => {
      this.categories = data;
      this.categories.forEach(category => {
        this.getProductsByCategory(category.name);
      });
    });
  }

  getProductsByCategory(categoryName: string): void {
    this.productService.getProductsByFilter('', undefined, categoryName).subscribe(
      (products: SupermarketProductPricesDto[]) => {
        this.productsByCategory[categoryName] = products; // Store products for each category
      },
      error => {
        console.error(`Error fetching products for category ${categoryName}:`, error);
      }
    );
  }

  filterByCategory(categoryName: string): void {
    this.route.navigate(['/search'], { queryParams: { categoryName: categoryName } });
  }

  getProductImageUrl(imagePath: String) {
    return `${this.url}/images/product/${imagePath}`;
  }
  getUserImageUrl(imagePath: string): string {
    return `${this.url}/images/user/${imagePath}`;
  }

  scrollLeft() {
    this.navContainer.nativeElement.scrollBy({
      left: -100,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    this.navContainer.nativeElement.scrollBy({
      left: 100,
      behavior: 'smooth'
    });
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

}
