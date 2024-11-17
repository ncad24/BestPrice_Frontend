import {Component, inject} from '@angular/core';
import {Product} from '../../../model/product';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CurrencyPipe, DecimalPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {UserAppService} from '../../../services/user-app.service';
import {UserList} from '../../../model/user-list';
import {FormsModule} from '@angular/forms';
import {UserInfoDto} from '../../../model/user-info-dto';
import {UserApp} from '../../../model/user-app';
import {SupermarketProductPricesDto} from '../../../model/supermarket-product-prices-dto';
import {ProductPerUserDto} from '../../../model/product-per-user-dto';
import {PricesByProductSupermarket} from '../../../model/prices-by-product-supermarket';
import {ProductService} from '../../../services/product.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    CurrencyPipe,
    ReactiveFormsModule,
    DecimalPipe,
    NgClass
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  listaForm: FormGroup;
  route: Router = inject(Router);
  userLists: any[] = [];
  products: any[] = [];
  selectedListId: number;
  showCreateListPopup: boolean = false;
  newListName: string = '';
  userInfo: UserInfoDto;
  isDropdownOpen = false;
  username: string;
  sortOption: string = 'price';
  supermarketPrices: PricesByProductSupermarket[] = [];
  userListService: UserAppService = inject(UserAppService);
  productService: ProductService = inject(ProductService);
  fb: FormBuilder = inject(FormBuilder);
  constructor(){
    this.listaForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';

    if (this.username) {
      this.loadUserInfo(this.username);
    }
  }

  loadUserInfo(username: string) {
    this.userListService.getUserByUsername(username).subscribe({
      next: (user) => {
        this.userInfo = user;
        this.loadUserLists();
        console.log('User Info:', this.userInfo);
      },
      error: (err) => {
        console.error('Error fetching user info:', err);
      }
    });
  }

  // Cargar una lista de un usuario
  loadUserLists(): void {
    if (this.userInfo && this.userInfo.userId) {
      this.userListService.getUserListById(this.userInfo.userId).subscribe({
        next: (lists: UserList[]) => {
          this.userLists = lists;
          console.log('User Lists:', this.userLists);
        },
        error: (err) => {
          console.error('Error fetching user lists:', err);
        }
      });
    } else {
      console.error('userInfo is undefined or userId is missing');
    }
  }

  // Cargar productos de una lista específica
  loadProducts(): void {
    console.log('selectedListId:', this.selectedListId);  // Verifica el ID de la lista seleccionada
    if (this.selectedListId) {
      this.userListService.getProductsFromList(this.selectedListId).subscribe({
        next: (list: ProductPerUserDto[]) => {
          this.products = list;
          this.loadSupermarketPrices(this.selectedListId);
        },
        error: (err) => {
          console.error('Error cargando los productos de la lista:', err);
          this.products = []; // Maneja el error de forma adecuada
        }
      });
    }
  }


  // Mostrar popup para crear una lista nueva
  openCreateListPopup(): void {
    this.showCreateListPopup = true;
  }

  // Cerrar popup de creación de lista
  closeCreateListPopup(): void {
    this.showCreateListPopup = false;
  }

  // Crear una nueva lista de usuarios
  createList(): void {
    if (this.listaForm.valid) {
      const listaNueva: UserList = new UserList();
      const userApp: Partial<UserApp> = { userId: this.userInfo.userId };
      listaNueva.name = this.listaForm.value.name;
      listaNueva.userApp = userApp as UserApp;
      this.userListService.registerUserList(listaNueva).subscribe(() => {
        this.loadUserLists();
        this.closeCreateListPopup();
      });
    }
  }

  // Ordenar productos según la opción seleccionada
  sortProducts(): void {
    if (this.sortOption === 'price') {
      this.products.sort((a: any, b: any) => a.price - b.price);
    } else if (this.sortOption === 'name') {
      this.products.sort((a: any, b: any) => a.name.localeCompare(b.name));
    }
  }
  deleteProduct(productId: number): void {
    if (this.selectedListId !== null) {
      this.userListService.removeProductFromList(this.selectedListId, productId).subscribe({
        next: () => {
          this.products = this.products.filter(product => product.id !== productId);
          this.loadProducts();
          alert('Producto eliminado exitosamente.');
        },
        error: (err) => {
          console.error('Error eliminando producto:', err);
          alert('Hubo un error al eliminar el producto.');
        }
      });
    }
  }
  loadSupermarketPrices(listId: number): void {
    this.userListService.getSumListProduct(listId).subscribe((data) => {
      this.supermarketPrices = data;
      this.supermarketPrices.sort((a, b) => a.productPrice - b.productPrice)
    });
  }
  getImageUrl(imagePath: string): string {
    return `http://localhost:8080/images/product/${imagePath}`;
  }
  getImageSupermarketUrl(imagePath: string): string {
    return `http://localhost:8080/images/supermarket/${imagePath}`;
  }
  getUserImageUrl(imagePath: String): String {
    return `http://localhost:8080/images/user/${imagePath}`;
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
