import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // Removido o LoadingController daqui
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import Swal from 'sweetalert2'; // <-- Importado o SweetAlert2

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
})
export class LoginPage {
  email = '';
  senha = '';
  isLoading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService // Nosso serviço global de alertas
  ) {}

  async login() {
    if (!this.email || !this.senha) {
      this.alertService.mostrarErro('Por favor, preencha email e senha');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.alertService.mostrarErro('Por favor, digite um email válido');
      return;
    }

    // Carregamento MINIMALISTA com SweetAlert2
    Swal.fire({
      title: 'A entrar...',
      width: '250px', // Deixa a caixinha bem menor e elegante
      padding: '24px',
      allowOutsideClick: false,
      showConfirmButton: false,
      heightAuto: false, // O nosso salva-vidas contra a tela preta!
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.isLoading = true;

    try {
      const response = await this.authService.login(this.email, this.senha).toPromise();
      
      Swal.close(); // Fecha o carregamento

      // O pequeno atraso para o Ionic limpar o backdrop sem travar a tela
      setTimeout(() => {
        if (response?.token) {
          this.alertService.mostrarToastSucesso('Login realizado com sucesso!');
          this.router.navigateByUrl('/home');
        } else {
          this.alertService.mostrarErro('Resposta inválida do servidor');
        }
      }, 150);

    } catch (error: any) {
      Swal.close(); // Fecha o carregamento em caso de erro
      
      setTimeout(() => {
        this.alertService.mostrarErro(error.message || 'Erro ao fazer login. Tente novamente.');
      }, 150);
    } finally {
      this.isLoading = false;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  clearFields() {
    this.email = '';
    this.senha = '';
    this.showPassword = false;
  }
}