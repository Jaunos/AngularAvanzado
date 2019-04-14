import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

    //Interceptor para manejar las respuestas

    return next.handle(req).pipe(
      catchError(e => {

        // Si el status es 401 - no autorizado (sin credenciales validas de autenticacion)
        // 0 403 -forbiden (prohibido) se retorna al usuario a la página de login
        if (e.status === 401) {

          // Si el token ha expirado
          if (this.authService.isAuthenticated()) {
            this.authService.logout();
          }

          this.router.navigate(['/login']);

        }
        if (e.status === 403) {
          swal('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso!`, 'warning')
          this.router.navigate(['/clientes']);

        }

        return throwError(e);
      })
    );
  }
}

