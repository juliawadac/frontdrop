import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule], // ngModel e componentes Ionic
})
export class LoginPage {
  email = '';
  senha = '';

  constructor(private http: HttpClient, private router: Router) { }

  login() {
    const dadosDoLogin = {
      email: this.email,
      senha: this.senha
    };

    this.http.post('http://localhost:3000/usuarios/login', dadosDoLogin)
      .subscribe({
        next: (res: any) => {
          // se a API retornar token:
          if (res?.token) localStorage.setItem('token', res.token);
          this.router.navigateByUrl('/home'); // ajuste a rota destino se necessário
        },
        error: (err) => {
          console.error('Erro no login:', err);
          alert('Email ou senha inválidos');
        },
      });
  }
}
