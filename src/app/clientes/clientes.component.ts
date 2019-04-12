import { ModalService } from './../services/modal.service';
import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from '../services/cliente.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'

})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;

  // Inyección de dependencias
  constructor(private clienteService: ClienteService,
              private activatedRoute: ActivatedRoute,
              private modalService: ModalService) { }

  ngOnInit() {

    // ruta que actualiza el número de página
    this.activatedRoute.paramMap.subscribe(params => {
      // Se obtiene la página mediante el parámetro + get
      // operador + transforma parámetro string a integer
      let page: number = + params.get('page');
      // Cuando page no exista se asigna a 0
      if (!page) {
        page = 0;
      }

      // Registrar el Observable. Nos debemos suscribir
      // y detro del método usar el observador
      // y se obtiene el valor obtenido desde el cliente service
      this.clienteService.getClientes(page)
        .pipe(
          tap(response => {
            console.log('ClientesComponent: tap 3');
            (response.content as Cliente[]).forEach(cliente => console.log(cliente.nombre));
          })
        ).subscribe(response => {
          this.clientes = response.content as Cliente[];
          // Añadir atributos de paginación
          // Se inyecta en la clase hijo paginator.component
          this.paginador = response;
        });

    });

    // Se llama al modalservice para terminar la implementacion del Emmiter
    // Se llama al metodod notificarUpload y nos suscribimos para obtener el cliente con la
    // imagen actualizada
    this.modalService.notificarUpload.subscribe(cliente => {
      // Se recorre el listado de clientes. Se comprueba si el cliente de la tabla es igual al cliente
      // que se está emitiendo. Si son iguales se actualiza.
       // map permite modificar un cliente y va a devolver el cliente modificado
      this.clientes = this.clientes.map(clienteOriginal => {
        // Se comprueba si el id del cliente es igual al id del clienteOriginal
        // Se actualiza su imagen y se devuelve el cliente actualizado
        if (cliente.id === clienteOriginal.id) {
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      });
    });


  }

  // Se implementa el método delete
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
      // Cuando el resultado es si, se elimina
      if (result.value) {
        // Se llama al servicio con el método de borrado y se le pasa el id del cliente
        this.clienteService.delete(cliente.id).subscribe(
          // En la respuesta se envía el mensaje
          response => {
            // se elimina del listado de clientes el objeto eliminado.
            // filter permite filtrar los elementos deseados y devolver un nuevo array
            // Si el cliente es distinto al cliente que se va a eliminar, se muestra en la vista.
            this.clientes = this.clientes.filter(cli => cli !== cliente);
            swal(
              'Cliente Eliminado!',
              `Cliente ${cliente.nombre} eliminado con éxito.`,
              'success'
            );
          });
      }
    });
  }

  // Se crea un método para mostrar el cliente seleccionado en un modal
  abrirModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
}
