import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilPageRoutingModule } from './perfil-routing.module';
import { PerfilComponent } from './perfil.component';

@NgModule({
  imports: [
    CommonModule,
    PerfilPageRoutingModule,
    PerfilComponent // ✅ importa o standalone
  ]
})
export class PerfilModule {}

