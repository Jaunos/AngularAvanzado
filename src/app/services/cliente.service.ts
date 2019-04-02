import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {CLIENTES } from '../clientes/clientes.json';
import { Cliente } from '../clientes/cliente';
import { Observable, of , throwError} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  //Se define el endpoint http
  private urlEndPoint: string = 'http://localhost:3621/api/clientes';

  //Atributo para las cabeceras http
  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  })

  //Se importa http para la comunicación con el servidor
  constructor(private http: HttpClient,
              private router: Router) { }

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
    return this.http.post(this.urlEndPoint, cliente, {headers: this.httpHeaders})
    .pipe(map((response: any) => response.cliente as Cliente),
      catchError(e => {
        console.error(e.error.mensaje);
        swal('Error al crear el cliente ', e.error.mensaje, 'error');
        //Se devuelve el error en un tipo Observable
        return throwError(e);
      })
    );
  }


  //método para obtener el cliente que se desea modificar
  getCliente(id) : Observable<Cliente>  {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      //Recibe un 404 cuando no se encuentra el objeto
      catchError(e => {
        if (e.status == 400){
           return throwError(e);
        }
        //Una vez capturado el error se redirige al cliente
        this.router.navigate(['/clientes']);
        console.log(e.error.mensaje);
        swal('Error al editar ', e.error.mensaje, 'error');
        //Se devuelve el error en un tipo Observable
        return throwError(e);
      })
    )
  }


  //metodo para actualizar clientes. Put actualiza datos en el servidor rest.
  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente,  {headers: this.httpHeaders} )
     .pipe(catchError(e => {
        if (e.status == 400){
           return throwError(e);
        }
        console.error(e.error.mensaje);
        swal('Error al editar el cliente ', e.error.mensaje, 'error');
        //Se devuelve el error en un tipo Observable
        return throwError(e);
      })
    );
  }

  //metodo para eliminar clientes. delete elimina datos en el servidor rest.
  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders})
     .pipe(catchError(e => {
        console.error(e.error.mensaje);
        swal('Error al eliminar el cliente ', e.error.mensaje, 'error');
        //Se devuelve el error en un tipo Observable
        return throwError(e);
      })
    );
  }
}
