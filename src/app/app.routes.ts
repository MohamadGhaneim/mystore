import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { AdminAddProductComponent } from './pages/admin-add-product/admin-add-product.component';
import { LoginComponent } from './pages/login/login.component';
import { OrderpageComponent } from './pages/orderpage/orderpage.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminAddProductComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'orderpage', component: OrderpageComponent },
];
