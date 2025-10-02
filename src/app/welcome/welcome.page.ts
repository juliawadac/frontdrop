import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class WelcomePage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    // Verificar se o usuário já está logado
    this.checkUserSession();
  }

  // Verificar se existe sessão ativa
  checkUserSession() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('currentUser');
    
    if (token && user) {
      // Se já estiver logado, redireciona para home
      console.log('Usuário já autenticado, redirecionando...');
      // Descomente a linha abaixo se quiser redirecionar automaticamente
      // this.router.navigate(['/home']);
    }
  }

  // Navegar para login
  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Navegar para cadastro
  goToSignup() {
    this.router.navigate(['/cadastro']);
  }

  // Continuar como visitante
  continueAsGuest() {
    console.log('Continuando como visitante');
    this.router.navigate(['/home']);
  }
}