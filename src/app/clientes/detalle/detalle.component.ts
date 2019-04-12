import { Component, OnInit, Input} from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  // Se inyecta un cliente
  @Input() cliente: Cliente;

  titulo: string = 'Detalle del cliente';
  private fotoSeleccionada; File;
  progreso: number = 0;


  constructor(private clienteService: ClienteService,
              // private activatedRote: ActivatedRoute,
              private modalService: ModalService) { }

  ngOnInit() {
    // // Nos suscribimos cuando cambie el parámetro del id
    // // para poder obtener el detalle del cliente
    // this.activatedRote.paramMap.subscribe(params => {
    //   // se obtiene el parámetro id
    //   let id: number = + params.get('id');
    //   // Si existe el id se obtiene el cliente a través del servicio
    //   // y se asigna a través del atributo cliente
    //   if (id) {
    //     // Se pasa el cliente obtenido del observable al atributo cliente
    //     this.clienteService.getCliente(id).subscribe(cliente => {
    //       this.cliente = cliente;
    //     });
    //   }
    // });

  }

  seleccionarFoto(event) {
    // Se asgina la imagen seleccionada al evento, el cual contiene un array de archivos
    // pero solo se selecciona el que se pretende subir
    this.fotoSeleccionada = event.target.files[0];

    // Cada vez que se selecciona una nueva imagen se reinicia su progreso
    this.progreso = 0;

    console.log(this.fotoSeleccionada);
    // Validar que el archivo subido es un archivo de tipo imagen
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      // Si el archivo subido es de otro tipo diferente a una imagen, lanza un error y se reinicia la carga
      swal('Error seleccionar imagen', 'El archivo debe ser de tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  // subirFoto() {

  //   if (!this.fotoSeleccionada) {
  //     swal('Error en la subida', 'Debe seleccionar una imagen', 'error');
  //   } else {
  //     this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
  //       .subscribe(cliente => {
  //         // Se obtiene el cliente desde el observable y suscribimos el cambio del cliente
  //         // que trae la imagen incluida
  //         this.cliente = cliente;
  //         swal('La imagen se ha subido correctamente', `Imagen ${this.cliente.foto}`, 'success');

  //       });
  //   }

  subirFoto() {

    if (!this.fotoSeleccionada) {
      swal('Error en la subida', 'Debe seleccionar una imagen', 'error');
    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
        .subscribe(event => {
          // Se obtiene el cliente desde el observable y suscribimos el cambio del cliente
          // que trae la imagen incluida
          // this.cliente = cliente;

          // Se pregunta si el archivo se está subiendo. HttpEventType es un enumerador con varias opciones
          // y se seleccion UploadProgress
          if (event.type === HttpEventType.UploadProgress) {
            // SE usa la clase Math y se divide lo subido por el total * 100
            this.progreso = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
            // captura el cliente creando una variable tipo resonse con el cuerpo del mensaje
            // y asignandoselo a un objeto cliente
            const response: any = event.body;
            this.cliente = response.cliente as Cliente;
            // Se emite la subida del archivo. Se envia el cliente actualizado
            // En el metodo get no son necesarios los parentesis
            // Nos suscribimos a este emiter en el listado de clientes en clientes.component.ts metodod onInit()
            this.modalService.notificarUpload.emit(this.cliente);

            swal('La imagen se ha subido correctamente!', response.mensaje, 'success');
          }
        });
    }
  }

  cerrarModal() {
    this.modalService.cerrarModal();
    // Cuando se cierre el modal establecemos a null la fotoSeleccionada y el progreso
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

}
