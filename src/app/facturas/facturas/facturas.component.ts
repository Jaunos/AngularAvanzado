import { ItemFactura } from './../models/itemFactura';
import { Component, OnInit } from '@angular/core';
import { Factura } from '../models/factura';
import { ClienteService } from 'src/app/services/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { FacturaService } from 'src/app/services/factura.service';
import { Producto } from '../models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  titulo: string = 'Nueva Factura';
  factura: Factura = new Factura();

  // Atributos para filtrado automcoplete
  autocompleteControl = new FormControl();
  productos: string[] = ['Mesa', 'Tablet', 'Sony', 'Samsung', 'Tv LG', 'Bicicleta'];
  productosFiltrados: Observable<Producto[]>;


  constructor(private clienteService: ClienteService,
              private activatedRoute: ActivatedRoute,
              private facturaService: FacturaService,
              private router: Router) { }

  ngOnInit() {
    // Se asigna el cliente a la Factura
    this.activatedRoute.paramMap.subscribe(params => {
      let clienteId = +params.get('clienteId');
      // Se obtiene el cliente desde backend
      this.clienteService.getCliente(clienteId).subscribe(cliente => {
        // Se asigna el cliente a la factura
        this.factura.cliente = cliente;
      });

    });

    // // Método para filtrado autocomplete. Listener para cuando cambie el valor del producto
    // // Por defecto muestra todos los productos
    // this.productosFiltrados = this.autocompleteControl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     // Map cambia el texto por todos los productos encontrados en la búsqueda
    //     // Y se asignan al atributo productosFitrados Observable
    //     map(producto => this._filter(producto))
    //   );

    // Método para filtrado autocomplete. Listener para cuando cambie el valor del producto
    // Se elimina startsWith para que solo muestre el producto filtrado
    this.productosFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        // Si el valor es distinto de string se devuelve el nombre del objeto de tipo producto
        map(value => typeof value === 'string' ? value : value.nombre),
        // Se convierte el observable de filter al que trae valueChanges con flatMap
        // Se controla que el valor exista. Si no existe se devuelve un array vacío
        flatMap(producto => producto ? this._filter(producto) : [])
      );
  }




  private _filter(producto: string): Observable<Producto[]> {
    // Se transforma el texto a minúsculas
    const productoFiltrado = producto.toLowerCase();
    // Devuelve el array de prueba de productos
    // return this.productos.filter(productos => productos.toLowerCase().includes(productoFiltrado));

    // Devuelve el término filtrado en un Observable de productos del endpoint de spring.
    return this.facturaService.filtrarProductos(producto);
  }

  // Método para transformar el objeto en string. La interrogiación indica que el valor es opcional
  mostrarNombre(producto?: Producto): string | undefined {
    // Si existe el producto se devuelve, si no, se devuelve undefined
    return producto ? producto.nombre : undefined;
  }

  // Método para obtener el producto seleccionado a traves del objeto event
  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    let producto = event.option.value as Producto;
    console.log(producto);

    // Si comprueba si existe el producto se incrementa su cantidad
    // Si no existe se crea otro producto
    if (this.existeItem(producto.id)) {
      this.incrementaCantidad(producto.id);
    } else {
      const nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      // Se añade el nuevoItem a la factura. Push permite añadir elementos  los arrays
      this.factura.items.push(nuevoItem);
    }

    // Se vacía el autocompletado para seguir añadiendo elementos a la factura y se
    // elimina el focus del evento
    this.autocompleteControl.setValue('');
    event.option.focus();
    // Se quita el producto seleccionado para poder seleccionar otro
    event.option.deselect();
  }

  // Método para actualizar la cantidad de los productos de forma dinámica
  actualizarCantidad(id: number, event: any): void {
    // Se obtiene la cantidad a través del objeto event
    let cantidad: number = event.target.value as number;

    // SI la cantidad es igual a 0, se elimina el producto del array
    if (cantidad == 0) {
      return this.eliminarItemFactura(id);
    }

    // Se busca en el array el objeto a través de su id y se actualiza su cantidad
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      // Si la id que se pasa por parámetro se encuentra en el array se modifica su cantidad
      if (id === item.producto.id) {
        item.cantidad = cantidad;
      }
      // Se devuelve el elemento actualizado
      return item;
    });

  }

  // Método que comprueba si existe el producto en el array
  existeItem(id: number): boolean {
    let existe = false;

    // Se itera a traves del array
    this.factura.items.forEach((item: ItemFactura) => {
      if (id === item.producto.id) {
        existe = true;
      }
    });
    return existe;
  }

  incrementaCantidad(id: number): void {
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      // Si la id que se pasa por parámetro se encuentra en el array se incrementa su cantidad
      if (id === item.producto.id) {
        ++item.cantidad;
      }
      // Se devuelve el elemento actualizado
      return item;
    });
  }

  // SE filtran todos los productos cuando el ID pasado por argumento sea distinto a la id del producto
  eliminarItemFactura(id: number): void {
    this.factura.items = this.factura.items.filter((item: ItemFactura) => id !== item.producto.id);
  }

  // Método para eliminar facturas
  create(): void {
    console.log(this.factura);
    // Se llama al metodo create del servicio y nos suscribimos para manejar la respuesta
    this.facturaService.create(this.factura).subscribe(factura => {
        swal(this.titulo, `Factura ${factura.descripcion} creada con éxito!`, 'success');
        this.router.navigate(['/clientes']);

    });
  }

}
