import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
// tslint:disable-next-line: component-selector
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  // Se crea un atributo clietne
  cliente: Cliente;
  titulo: string = 'Detalle del cliente';
  private fotoSeleccionada; File;

  constructor(private clienteService: ClienteService,
              private activatedRote: ActivatedRoute) { }

  ngOnInit() {
    // Nos suscribimos cuando cambie el parámetro del id
    // para poder obtener el detalle del cliente
    this.activatedRote.paramMap.subscribe(params => {
      // se obtiene el parámetro id
      let id: number = + params.get('id');
      // Si existe el id se obtiene el cliente a través del servicio
      // y se asigna a través del atributo cliente
      if (id) {
        // Se pasa el cliente obtenido del observable al atributo cliente
        this.clienteService.getCliente(id).subscribe( cliente => {
          this.cliente = cliente;
        });
      }});
  }

  seleccionarFoto(event) {
    // Se asgina la imagen seleccionada al evento, el cual contiene un array de archivos
    // pero solo se selecciona el que se pretende subir
    this.fotoSeleccionada = event.target.files[0];
    console.log(this.fotoSeleccionada);
  }


  subirFoto() {
    this.clienteService.subirFoto( this.fotoSeleccionada, this.cliente.id)
    .subscribe(cliente => {
      // Se obtiene el cliente desde el observable y suscribimos el cambio del cliente
      // que trae la imagen incluida
      this.cliente = cliente;
      swal('La imagen se ha subido correctamente', `Imagen ${this.cliente.foto}`, 'success' );

    });
  }

}
