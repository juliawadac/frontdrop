import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SacolaPageRoutingModule } from './sacola-routing.module';
import { SacolaPage } from './sacola.component'; // Importação do componente standalone

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SacolaPage, // ✅ Importando o componente standalone
    SacolaPageRoutingModule
  ]
})
export class SacolaPageModule {}