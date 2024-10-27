import { Routes } from '@angular/router';
import {LandingComponent} from './component/landing/landing.component';
import {LoginComponent} from './component/login/login.component';
import {RegisterComponent} from './component/register/register.component';
import {CategoryComponent} from './component/admin/category/category.component';
import {authGuard} from './util/auth.guard';
import {BrandComponent} from './component/admin/brand/brand.component';
import {SupermarketComponent} from './component/admin/supermarket/supermarket.component';
import {ProductComponent} from './component/admin/product/product.component';
import {NavbarComponent} from './component/navbar/navbar.component';


export const routes: Routes = [
  {path: '', component: LandingComponent, pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {
    path: 'admin',
    component: NavbarComponent,
    canActivate: [authGuard],
    children: [
      { path: 'product', component: ProductComponent },
      { path: 'supermarket', component: SupermarketComponent },
      { path: 'brand', component: BrandComponent },
      { path: 'category', component: CategoryComponent },
    ]
  },
];
