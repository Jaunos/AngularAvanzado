import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from '../services/cliente.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'

})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];

  //Inyección de dependencias
  constructor(private clienteService: ClienteService) { }

  ngOnInit() {

    // this.clientes = this.clienteService.getClientes();

    //Registrar el Observable. Nos debemos suscribir
    //y detro del método usar el observador
    // y se obtiene el valor obtenido desde el cliente service
    this.clienteService.getClientes().pipe(
      //RESPONSE DE TIPO OBJECT
      tap(clientes => {
        //Este tap ya no necesita la conversión, ya es de tipo Cliente
        clientes.forEach(cliente => {
          //Una vez realizada la conversión se pueden mostrar los datos de los clientes
          //en el log
          console.log(cliente.nombre);
        });
      })
    ).subscribe(
      //se asigna el parámetro clientes a this.clientes
      //actualizando el listado de clientes
      clientes => this.clientes = clientes

      //La función anterior es igual a la siguiente
      //se usa la llave cuando hay más de una línea de código
      //se usa paréntesis cuando hay más de un argumento

      // (clientes) =>  {
      //   this.clientes = clientes
      // }
    );

  }

  //Se implementa el método delete
  delete(cliente: Cliente): void {
    swal({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      //Cuando el resultado es si, se elimina
      if (result.value) {
        //Se llama al servicio con el método de borrado y se le pasa el id del cliente
        this.clienteService.delete(cliente.id).subscribe(
          //En la respuesta se envía el mensaje
          response => {
            //se elimina del listado de clientes el objeto eliminado.
            //filter permite filtrar los elementos deseados y devolver un nuevo array
            //Si el cliente es distinto al cliente que se va a eliminar, se muestra en la vista.
            this.clientes = this.clientes.filter(cli => cli !== cliente);
            swal(
              'Cliente Eliminado!',
              `Cliente ${cliente.nombre} eliminado con éxito.`,
              'success'
            )}
            )
      }
    });
  }
}
