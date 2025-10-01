import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Importa o componente standalone
import { EstabelecimentoPage } from './estabelecimento.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    HttpClientModule, // ✅ Adicionado para fazer requisições HTTP
    EstabelecimentoPage // ✅ Importa o componente standalone
  ],
})
export class EstabelecimentoModule {}