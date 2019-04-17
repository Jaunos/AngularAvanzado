import { ActivatedRoute } from '@angular/router';
import { Factura } from './../models/factura';
import { Component, OnInit } from '@angular/core';
import { FacturaService } from 'src/app/services/factura.service';



@Component({
  selector: 'app-detalleFactura',
  templateUrl: './detalleFactura.component.html'
})
export class DetalleFacturaComponent implements OnInit {

  factura: Factura;
  titulo: string = 'Factura';

  constructor(private facturaService: FacturaService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // Obtenemos los parámetros de la factura
    this.activatedRoute.paramMap.subscribe(params => {
      // Obtenemos el id y a partir de la id, se obtiene la factura. mediante = + se convierte a numérico
     let id = +params.get('id');
      this.facturaService.getFactura(id).subscribe(factura => this.factura = factura);
    });
  }



}
