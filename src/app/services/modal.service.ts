import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal: boolean = false;

  // Variable para crear un Listener para escuchar la
  // subida de archivos
// tslint:disable-next-line: variable-name
  private _notificarUpload = new EventEmitter<any>();

  constructor() { }

  abrirModal() {
    this.modal = true;
  }

  cerrarModal() {
    this.modal = false;
  }

  // Getter notificarUppload
  get notificarUpload(): EventEmitter<any> {
    return this._notificarUpload;

  }

}
