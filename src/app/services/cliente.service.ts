import { Injectable } from '@angular/core';
import {CLIENTES } from '../clientes/clientes.json';
import { Cliente } from '../clientes/cliente';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';


 
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  //Se define el endpoint http
  private urlEndPoint: string = 'http://localhost:8080/api/clientes'; 

  //Atributo para las cabeceras http
  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  })

  //Se importa http para la comunicación con el servidor
  constructor(private http: HttpClient) { }

  // getClientes(): Cliente[] {
  //   return CLIENTES;
  // }

//convertir a observable para transformarlo
//en asíncrono
  getClientes(): Observable<Cliente[]> {
    // return of(CLIENTES);

    //Se castea el resultado para que devuelva un objeto de tipo cliente en vez de json
    //map tambien permite convertir el objeto json en tipo cliente
    // return this.http.get<Cliente[]>(this.urlEndPoint)

    //Segunda forma de casteo con map
    return this.http.get(this.urlEndPoint).pipe(
      map(response => response as Cliente[] )
    );
  }


  //metodo para crear clientes, recibe un cliente en formato JSON y devuelve un observable. Post crea datos en el
  //servidor rest.
  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.urlEndPoint, cliente, {headers: this.httpHeaders})
  }


  //método para obtener el cliente que se desea modificar
  getCliente(id) : Observable<Cliente>  {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`)
  }
  

  //metodo para actualizar clientes. Put actualiza datos en el servidor rest.
  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente,  {headers: this.httpHeaders} )
  }

  //metodo para eliminar clientes. delete elimina datos en el servidor rest.
  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders})
  }
}
