import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-estabelecimento',
  templateUrl: './estabelecimento.page.html',
  styleUrls: ['./estabelecimento.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class EstabelecimentoPage {
  tempoEspera = 90;
  produtos = [
    { nome: 'Nome do produto', descricao: 'Breve descrição do produto', preco: 0.0 },
    { nome: 'Nome do produto', descricao: 'Breve descrição do produto', preco: 0.0 },
    { nome: 'Nome do produto', descricao: 'Breve descrição do produto', preco: 0.0 },
  ];
}
