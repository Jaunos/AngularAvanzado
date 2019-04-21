import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title = 'App Angular';

  // En producción debe ser public
  constructor(public authService: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  logout(): void {
    const username = this.authService.usuario.username;
    this.authService.logout();
    swal('Logout', `Hola ${username} has cerrado sesión con éxito`);
    this.router.navigate(['/login']);
  }

}
