import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HistoricoPageRoutingModule } from './historico-routing.module';
import { HistoricoPage } from './historico.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HistoricoPage,
    HistoricoPageRoutingModule
  ]
})
export class HistoricoPageModule {}
