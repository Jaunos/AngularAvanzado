import { Injectable } from '@angular/core';
import {CLIENTES } from '../clientes/clientes.json';
import {Cliente} from '../clientes/cliente';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

 
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  //Se define el endpoint http
  private urlEndPoint: string = 'http://localhost:8080/api/clientes'; 

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
    return this.http.get<Cliente[]>(this.urlEndPoint)

    //Segunda forma de casteo con map
    // return this.http.get(this.urlEndPoint).pipe(
    //   map(response => response as Cliente[] )
    // );
  }


  
}
