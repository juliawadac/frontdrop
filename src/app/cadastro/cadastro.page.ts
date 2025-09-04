import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, HttpClientModule, RouterModule],
})
export class CadastroPage {
  nome = '';
  sobrenome = '';
  email = '';
  senha = '';
  endereco = '';
  numero = '';

  constructor(private http: HttpClient, private router: Router) {}

  cadastrar() {
    if (!this.nome || !this.sobrenome || !this.email || !this.senha) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    const dadosDoCadastro = {
      nome: this.nome,
      sobrenome: this.sobrenome,
      email: this.email,
      senha: this.senha,
      endereco: this.endereco,
      numero: this.numero,
    };

    this.http.post('http://localhost:3000/usuarios/cadastrar', dadosDoCadastro).subscribe({
      next: () => {
        alert('Cadastro realizado com sucesso!');
        this.router.navigateByUrl('/login'); // redireciona para login após cadastro
      },
      error: (err) => {
        console.error('Erro no cadastro:', err);
        alert('Erro ao cadastrar. Verifique o console.');
      },
    });
  }

  irParaLogin() {
    this.router.navigateByUrl('/login');
  }

  irParaCadastro() {
    this.router.navigateByUrl('/cadastro');
  }
}
