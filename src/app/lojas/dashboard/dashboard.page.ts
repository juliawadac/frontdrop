import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AlertService } from '../../services/alert.service'; // <-- Caminho corrigido! (3 pontinhos em vez de 5)

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class DashboardPage implements OnInit {
  
  logoUrl: string | null = null;

  constructor(
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.carregarLogo();
  }

  carregarLogo() {
    const lojaLocal = localStorage.getItem('currentLoja');
    
    if (lojaLocal) {
      const loja = JSON.parse(lojaLocal);
      
      if (loja.logo_url) {
        this.logoUrl = loja.logo_url;
      }
    }
  }

  tratarErroDeLocalizacao(erro?: any) {
     this.alertService.mostrarErro('Falha ao obter a localização. Por favor, verifique as permissões.');
  }

}