import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../usuarios';
import swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo: string = 'Por favor Inicie sesión';
  usuario: Usuarios;

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuarios();
  }

  ngOnInit() {
    // Se comprueba que el usuario esté logueado
    if (this.authService.isAuthenticated()) {
      swal('Login', `Hola ${this.authService.usuario.username} ya estás autenticado`, 'info');
      this.router.navigate(['/clientes']);
    }
  }

  login(): void {
    console.log(this.usuario.username, this.usuario.password);

    if (this.usuario.username == null || this.usuario.password == null) {
      swal('Error Login', 'Nombre de usuario o Contraseña vacíos', 'error');
      return;
    }
    this.authService.login(this.usuario).subscribe(
      // Si todo sale bien (se loguea el usuario)
      response => {
        console.log(response);
        // Se llama al método get usuario de auth service
        let usuario = this.authService.usuario;
        // Se guarda el token del usuario
        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);
        this.router.navigate(['/clientes']);
        swal('Login', `Hola ${usuario.username}, has iniciado sesión con éxito`, 'success');
      },
      // Si sale mal o no se loguea
      err => {
        // Nos aseguramos que el status sea 400
        if (err.status == 400) {
          swal('Error Login', 'Nombre de usuario o Contraseña incorrectos', 'error');
        }
      });
  }

}
