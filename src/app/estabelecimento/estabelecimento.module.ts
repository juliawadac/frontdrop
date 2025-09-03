import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

// Importa o componente standalone
import { EstabelecimentoPage } from './estabelecimento.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    EstabelecimentoPage // ✅ Importa o componente standalone
  ],
})
export class EstabelecimentoModule {}
