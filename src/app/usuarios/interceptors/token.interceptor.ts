import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

    // Se obtiene el token
    let token = this.authService.token;

    // Si es distinto de null se envia el token en las cabeceras modificadas
    if (token != null) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
      console.log('TokenInterceptor => Bearer' + token);
      // Devuelve el próximo interceptor de las request modificadas
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
