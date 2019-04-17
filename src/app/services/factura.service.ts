import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Factura } from '../facturas/models/factura';
import { Producto } from '../facturas/models/producto';


@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  // Endpoint hacia api/facturas
  private urlEndPoint: string = 'http://localhost:8080/api/facturas';
  private urlFilter: string = 'http://localhost:8080/api/facturas/filtrar-productos';

  constructor(private http: HttpClient) { }


  // Método para obtener facturas que retorna un observable de factura
  getFactura(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.urlEndPoint}/${id}`);
  }

  // Método para eliminar facturas
  delete(id: number): Observable<void> {
   return this.http.delete<void>(`${this.urlEndPoint}/${id}`);

  }

  // Método para filtrar productos que devuelve un observable de tipo producto
  filtrarProductos(termino: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.urlFilter}/${termino}`);
  }

  // Método para crear facturas
  create(factura:Factura ): Observable<Factura> {
    return this.http.post<Factura>(this.urlEndPoint, factura);
  }
}
