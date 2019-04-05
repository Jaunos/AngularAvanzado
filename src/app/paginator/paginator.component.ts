import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnInit, OnChanges {

  // Se inyecta desde la clase padre clientes.component
  @Input() paginador: any;
  // Array que almacenará el número de páginas
  paginas: number[];

  // atributos para mostrar rangos de páginas desde un valor
  // hasta otro valor
  desde: number;
  hasta: number;

  constructor() { }

  ngOnInit() {
    this.initPaginator();
  }

  ngOnChanges(changes: SimpleChanges) {
    const paginadorActualizado = changes.paginador;

    if (paginadorActualizado.previousValue) {
      this.initPaginator();
    }
  }

  private initPaginator(): void {
    // SE calcula con la función minimo entre 2 valores
    this.desde = Math.min(Math.max(1, this.paginador.number - 4), this.paginador.totalPages - 5);
    // Se calcula con la funcion máximo entre 2 valores
    this.hasta = Math.max(Math.min(this.paginador.totalPages, this.paginador.number + 3), 3);

    // Se calculan ambos rangos cuando el total de páginas sea mayor que 5
    // Si es correcto, se calcula el nuevo rango
    if (this.paginador.totalPages > 5) {

      this.paginas = new Array(this.hasta - this.desde + 1).fill(0)
        .map((_valor, indice) => indice + this.desde);

      // Si no, se dejan ambos valores sin modificar
    } else {


      // Se almacenan las páginas en el array con 0
      // Se transforman los valores mediante un map que recibe como argumento
      // un valor y un índice[ valor 0 + 1 (para que comience la pagina en 1),
      // indice desde 0 hasta el final del elemento]
      // para que no aparezca un warning sobre un elemento que no se utiliza se añade '_+nombre_variable'
      this.paginas = new Array(this.paginador.totalPages).fill(0)
        .map((_valor, indice) => indice + 1);
    }

  }

}
