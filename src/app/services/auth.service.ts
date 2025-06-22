import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private URL = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.URL}/login`, { username, password });
  }

  add_products(FormData: FormData): Observable<any> {
    return this.http.post(`${this.URL}/products`, FormData);
  }
  get_products(): Observable<any> {
    return this.http.get(`${this.URL}/products`);
  }

  update_product(formData: FormData) {
    //alert("auth"+ formData.get('id'));
    return this.http.put<any>(`${this.URL}/products`, formData);
  }

  delete_product(id: number) {
    //alert(' auth' + id);
    return this.http.delete<any>(`${this.URL}/products/${id}`);
  }

  updateQuantities(
    products: { id: number; newQuantity: number }[]
  ): Observable<any> {
    return this.http.put(`${this.URL}/products/quantities`, { products });
  }
}
