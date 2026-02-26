import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

// Importa o componente standalone
import { PerfilPage } from './perfil.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    PerfilPage // ✅ Importa o componente standalone
  ],
})
export class PerfilModule {}