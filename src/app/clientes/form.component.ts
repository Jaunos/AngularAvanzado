import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteService } from '../services/cliente.service';
import  swal  from 'sweetalert2';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  private cliente: Cliente  = new Cliente();
  private titulo: string = "Crear Cliente";

  constructor(private clienteService: ClienteService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    //Se llama al método para que cargue los datos del cliente a editar en el formulario
    this.cargarCliente();
  }

  //Asigna la respuesta del servidor al objeto cliente
  cargarCliente( ): void {
    this.activatedRoute.params.subscribe(
      params => {
        const id = params['id']
        //Si existe la id, se busca el cliente
        if(id) {
          //se asigna el cliente mediante la respuesta de la función
          //anonima
          this.clienteService.getCliente(id).subscribe(
            cliente => {
              this.cliente=cliente
            }
          )
        }
      });
  }


  //Se crea el metodo create para guardar clientes
  // public create() : void {
  //   console.log(this.cliente);
  // }

  public create(): void {
    this.clienteService.create(this.cliente).subscribe(
      //Nos suscribimos para obtener la respuesta y se determina la acción de la
      //función anónima. Una vez guardado, redirige al listado de clientes
      cliente =>  { 
        this.router.navigate(['/clientes'])
        swal('Nuevo cliente', `Cliente ${cliente.nombre} creado con éxito!`, 'success')
      });
    console.log(this.cliente);
  }
  

  //Método para actualizar parámetros del cliente
  update(): void {
    this.clienteService.update(this.cliente)
    //Nos suscribimos para obtener la respuesta y se determina la acción de la
      //función anónima. Una vez actualizado, redirige al listado de clientes
    .subscribe (cliente => {
      this.router.navigate(['/clientes'])
      swal('Cliente Actualizado', `Cliente ${cliente.nombre} actualizado con éxito!`, 'success')
    })
  }
}
