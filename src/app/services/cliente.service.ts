import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CLIENTES } from '../clientes/clientes.json';
import { Cliente } from '../clientes/cliente';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { formatDate, DatePipe } from '@angular/common';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  //Se define el endpoint http
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  //Atributo para las cabeceras http
  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  //Se importa http para la comunicación con el servidor
  constructor(private http: HttpClient,
              private router: Router) { }

  // getClientes(): Cliente[] {
  //   return CLIENTES;
  // }

  // convertir a observable para transformarlo
  // en asíncrono
  // getClientes(page: number): Observable<any[]> {
  //   // return of(CLIENTES);

  //   // Se castea el resultado para que devuelva un objeto de tipo cliente en vez de json
  //   // map tambien permite convertir el objeto json en tipo cliente
  //   // return this.http.get<Cliente[]>(this.urlEndPoint)

  //   // Segunda forma de casteo con map
  //   // Se añade page a la url para usar la paginación
  //     // map del observable para modificar los datos de
  //     // tipo json a otro tipo de valor
  //   return this.http.get(this.urlEndPoint + '/page/' + page)
  //     .pipe(tap((response: any) => {
  //         //Modificacion para utilizar la paginación mediante backen
  //         //Una vez realizada la conversión se pueden mostrar los datos de los clientes
  //         //en el log
  //         (response.content as Cliente[]).forEach(cliente => console.log(cliente.nombre));
  //       }),
  //       map((response: any) => {
  //         //map del array para modificar sus propios valores
  //         (response.content as Cliente[]).map(cliente => {
  //           //Por cada cliente se cambia su nombre a mayúsculas
  //           cliente.nombre = cliente.nombre.toUpperCase();
  //           //Modificar formato fecha - Forma 1
  //           // cliente.createAt = formatDate(cliente.createAt, 'dd-mm-yyyy', 'en-US');
  //           //Modificar formato fecha - Forma 2
  //           const datePipe = new DatePipe('es-ES');
  //           // cliente.createAt = datePipe.transform(cliente.createAt, 'dd/mm/yyyy');
  //           cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
  //           return cliente;
  //         });
  //         return response;
  //       }),
  //       //RESPONSE DE TIPO CLIENTE MODIFICADO POR EL MAP ANTERIOR
  //       tap(response => {
  //         //Este tap ya no necesita la conversión, ya es de tipo Cliente
  //         //Una vez realizada la conversión se pueden mostrar los datos de los clientes
  //         //en el log
  //         (response.content as Cliente[]).forEach(cliente => console.log(cliente.nombre));
  //       })
  //     );
  // }
getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('ClienteService: tap 1');
        (response.content as Cliente[]).forEach(cliente => console.log(cliente.nombre));
      }),
      map((response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          //let datePipe = new DatePipe('es');
          //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
          //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'es');
          return cliente;
        });
        return response;
      }),
      tap(response => {
        console.log('ClienteService: tap 2');
        (response.content as Cliente[]).forEach(cliente => console.log(cliente.nombre));
      })
    );
  }

  //metodo para crear clientes, recibe un cliente en formato JSON y devuelve un observable. Post crea datos en el
  //servidor rest.
  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente, { headers: this.httpHeaders })
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
  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      //Recibe un 404 cuando no se encuentra el objeto
      catchError(e => {
        if (e.status === 400) {
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
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, { headers: this.httpHeaders })
      .pipe(catchError(e => {
        if (e.status === 400) {
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
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders })
      .pipe(catchError(e => {
        console.error(e.error.mensaje);
        swal('Error al eliminar el cliente ', e.error.mensaje, 'error');
        //Se devuelve el error en un tipo Observable
        return throwError(e);
      })
      );
  }
}
