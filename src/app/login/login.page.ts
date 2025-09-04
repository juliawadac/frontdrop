import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule, RouterModule],
})
export class LoginPage {
  email = '';
  senha = '';

  constructor(private http: HttpClient, private router: Router) { }

  login() {
    const dadosDoLogin = { email: this.email, senha: this.senha };

    this.http.post('http://localhost:3000/usuarios/login', dadosDoLogin)
      .subscribe({
        next: (res: any) => {
          if (res?.token) localStorage.setItem('token', res.token);
          this.router.navigateByUrl('/home'); // Agora funciona!
        },
        error: (err) => {
          console.error('Erro no login:', err);
          alert('Email ou senha inválidos');
        },
      });
  }
}
