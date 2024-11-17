import { Routes } from '@angular/router';
import {LandingComponent} from './component/landing/landing.component';
import {LoginComponent} from './component/login/login.component';
import {CategoryComponent} from './component/admin/category/category.component';
import {authGuard} from './util/auth.guard';
import {BrandComponent} from './component/admin/brand/brand.component';
import {SupermarketComponent} from './component/admin/supermarket/supermarket.component';
import {ProductComponent} from './component/admin/product/product.component';
import {NavbarComponent} from './component/navbar/navbar.component';
import {HomeComponent} from './component/user/home/home.component';
import {SearchProductComponent} from './component/user/search-product/search-product.component';
import {DashboardComponent} from './component/admin/dashboard/dashboard.component';
import {ProductViewComponent} from './component/user/product-view/product-view.component';
import {AssignSupermarketComponent} from './component/pop-ups/assign-supermarket/assign-supermarket.component';
import {ProductListComponent} from './component/user/product-list/product-list.component';


export const routes: Routes = [
  {path: '', component: LandingComponent, pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [authGuard] },
  {path: 'search', component: SearchProductComponent, canActivate: [authGuard] },
  {path: 'product-list', component: ProductListComponent, canActivate: [authGuard] },
  {path: 'product-view/:id', component: ProductViewComponent, canActivate: [authGuard]},
  {
    path: 'admin',
    component: NavbarComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'product', component: ProductComponent },
      { path: 'supermarket', component: SupermarketComponent },
      { path: 'brand', component: BrandComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'register-brand', component: BrandComponent},
      { path: 'assign-supermarket', component: AssignSupermarketComponent },
    ]
  },
];
