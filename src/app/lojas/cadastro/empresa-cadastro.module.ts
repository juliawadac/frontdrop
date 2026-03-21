import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { EmpresaCadastroPageRoutingModule } from './empresa-cadastro-routing.module';
import { EmpresaCadastroPage } from './empresa-cadastro.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    EmpresaCadastroPage, // standalone
    EmpresaCadastroPageRoutingModule
  ]
})
export class EmpresaCadastroPageModule {}
