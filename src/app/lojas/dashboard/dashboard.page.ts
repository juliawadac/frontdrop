import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class DashboardPage implements OnInit {
  
  // 1. Variável criada para resolver o erro do HTML e guardar a foto
  logoUrl: string | null = null;

  constructor() {}

  // 2. Quando a tela carregar, vamos buscar a foto da loja
  ngOnInit() {
    this.carregarLogo();
  }

  carregarLogo() {
    // Puxa os dados da loja que estão logados no momento
    const lojaLocal = localStorage.getItem('currentLoja');
    
    if (lojaLocal) {
      const loja = JSON.parse(lojaLocal);
      
      // Se a loja tiver uma logo (logo_url), passa para a variável
      if (loja.logo_url) {
        this.logoUrl = loja.logo_url;
      }
    }
  }
}