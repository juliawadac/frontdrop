import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule], // 👈 aqui você importa os componentes Ionic
})
export class PerfilComponent {
  fotoPerfil: string | null = null;

  abrirSeletor() {
    document.getElementById('inputFoto')?.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPerfil = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
