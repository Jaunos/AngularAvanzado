import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuarios } from '../usuarios/usuarios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Se definen los atributos para el usuario y para el token
  private _usuario: Usuarios;
  private _token: string;

  constructor(private http: HttpClient) { }

  // Getter y Setter
  public get usuario(): Usuarios {
    // Si existe el usuario se devuelve
    // Si no existe, se pregunta si existe en el sessionStorage
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
      // Se convierte el usuario almacenado en el storage en un objeto con la clase JSON
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuarios;
      return this._usuario;

    }
    // Si el usuario no existe se devuelve un objeto vacio
    return new Usuarios();
  }
  public get token(): string {
    // Si existe el token se devuelve
    // Si no existe, se pregunta si existe en el sessionStorage
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      // Se devuelve el token almacenado
      this._token = sessionStorage.getItem('token');
      return this._token;

    }
    // Si el token no existe se devuelve null
    return null;
  }


  login(usuario: Usuarios): Observable<any> {
    const urlEndpoint = 'http://localhost:8080/oauth/token';

    const credenciales = btoa('angularapp' + ':' + '12345');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    console.log(params.toString());
    return this.http.post<any>(urlEndpoint, params.toString(), { headers: httpHeaders });
  }


  guardarUsuario(accessToken: string): void {
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuarios();
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;
    // Se guarda el usuario en la sesión
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split('.')[1]));
    }
    return null;
  }

  // Preguntamos si el usuario está autenticado
  isAuthenticated(): boolean {
    // Se obtienen los datos a traves del token de acceso. Se pasa por paramentro getToken.
    let payload = this.obtenerDatosToken(this.token);

    if (payload != null && payload.user_name
      && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  hasRole(role: string): boolean {
    // Si el usuario contiene un rol
    if (this.usuario.roles.includes(role)) {
      return true;
    }
    return false;
  }


  logout(): void {
    // Se establece el token y el usuario a null y se eliminan del sessionStorage
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    // o
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
  }
}
