import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteService } from '../services/cliente.service';
import swal from 'sweetalert2';
import { Region } from './../clientes/region';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: Cliente  = new Cliente();
  public titulo: string = "Crear Cliente";
  public errores: string[];
  regiones: Region[];

  constructor(private clienteService: ClienteService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // Se llama al método para que cargue los datos del cliente a editar en el formulario
    this.cargarCliente();
  }

  // Asigna la respuesta del servidor al objeto cliente
  cargarCliente( ): void {
    this.activatedRoute.params.subscribe(
      params => {
        const id = params['id']
        // Si existe la id, se busca el cliente
        if (id) {
          // se asigna el cliente mediante la respuesta de la función
          // anonima
          this.clienteService.getCliente(id).subscribe(
            cliente => {
              this.cliente = cliente;
            }
          )}
      });
      // Observador que asigna las regiones de la base de datos al array de regiones
      // con las que se trabajará en la vista y se asignarán al usuario mediante un desplegable
    this.clienteService.getRegiones().subscribe((regiones) => this.regiones = regiones);
  }


  // Se crea el metodo create para guardar clientes
  // public create() : void {
  //   console.log(this.cliente);
  // }

// Método objeto cliente
  public create(): void {
    console.log(this.cliente);
    this.clienteService.create(this.cliente).subscribe(
      //  Nos suscribimos para obtener la respuesta y se determina la acción de la
      // función anónima. Una vez guardado, redirige al listado de clientes
      cliente =>  {
        this.router.navigate(['/clientes']);
        swal('Nuevo cliente', `El cliente ${cliente.nombre} ha sido creado con éxito!`, 'success')
      },
      // Se controla el error
      err => {
        this.errores = err.error.errors as string[];
        // Opcional
        console.error('Código del error desde backend ' + err.error.errors);
        console.error(err.error.errors);

      }
      );
    console.log(this.cliente);
  }


  // Método para actualizar parámetros del cliente- Modo JSON
  update(): void {
    console.log(this.cliente);
    this.clienteService.update(this.cliente)
    // Nos suscribimos para obtener la respuesta y se determina la acción de la
      // función anónima. Una vez actualizado, redirige al listado de clientes
    .subscribe (res => {
      this.router.navigate(['/clientes']);
      swal('Cliente Actualizado', `${res.mensaje}: ${res.nombre} actualizado con éxito!`, 'success')
    },
      // Se controla el error
      err => {
        this.errores = err.error.errors as string[];
        // Opcional
        console.error('Código del error desde backend ' + err.error.errors);
        console.error(err.error.errors);

      }
    );
  }


  // Metodo para compara region que recibe como parámetros
  // Objeto 1 que se corresponde con cada iteración del array de regiones
  // Objeto 2 que se corresponde con la region del cliente
  // Que devolverá un booleano
  compararRegion(O1: Region, O2: Region): boolean {
    // Si el objeto 1 y 2 son undefined se devuelve true
    if ( O1 === undefined && O2 === undefined) {
      return true;
    }

    // Si alguno de los dos objetos es null se devuelve false
    // Por el contrario,se compara las id que pueden devolver true o false (Solo devuelve true en editar)
    return O1 === null || O2 === null || O1 === undefined || O2 === undefined ? false : O1.id === O2.id;
  }
}
