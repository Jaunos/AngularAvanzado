import { Cliente } from './../../clientes/cliente';
import { ItemFactura } from './itemFactura';
export class Factura {

  id: number;
  descripcion: string;
  observacion: string;
  items: Array<ItemFactura> = [];
  cliente: Cliente;
  total: number;
  createAt: string;


  // Se recorre cada objeto y se suma
  calcularTotal(): number {
    // Se inicializa el total en 0
    this.total = 0;
    this.items.forEach((item: ItemFactura) => {
      // A medid a que se recorre se suma
      this.total += item.calcularImporte();

    });
    return this.total;
  }

}
