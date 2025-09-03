import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ✅ Importação do RouterModule

@Component({
  selector: 'app-sacola',
  templateUrl: './sacola.component.html',
  styleUrls: ['./sacola.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule] // ✅ Adicionado RouterModule
})
export class SacolaPage {}