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

  selectedProfile: 'cliente' | 'empresa' | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkUserSession();
  }

  checkUserSession() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('currentUser');

    if (token && user) {
      console.log('Usuário já autenticado, redirecionando...');
      // this.router.navigate(['/home']);
    }
  }

  selectProfile(profile: 'cliente' | 'empresa') {
    this.selectedProfile = profile;
  }

  goToLogin() {
    if (!this.selectedProfile) return;

    if (this.selectedProfile === 'empresa') {
      this.router.navigate(['/empresa/login']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  goToSignup() {
    if (!this.selectedProfile) return;

    if (this.selectedProfile === 'empresa') {
      this.router.navigate(['/empresa/cadastro']);
    } else {
      this.router.navigate(['/cadastro']);
    }
  }

  continueAsGuest() {
    console.log('Continuando como visitante');
    this.router.navigate(['/home']);
  }
}