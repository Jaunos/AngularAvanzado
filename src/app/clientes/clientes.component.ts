import { Component, OnInit } from '@angular/core';
import {Cliente} from './cliente';
import { ClienteService } from '../services/cliente.service';


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
    this.clienteService.getClientes()
      .subscribe(
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

}
