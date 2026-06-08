import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  // 1. Toast de Sucesso (Aquele que aparece rápido em baixo e some)
  mostrarToastSucesso(mensagem: string) {
    Swal.fire({
      toast: true,
      position: 'bottom',
      icon: 'success',
      title: mensagem,
      showConfirmButton: false,
      timer: 3000,
      iconColor: '#99521c',
      customClass: {
        popup: 'colored-toast'
      }
    });
  }

  // 2. Alerta de Erro (Modal no centro da tela)
  mostrarErro(mensagem: string) {
    Swal.fire({
      title: 'Ops!',
      text: mensagem,
      icon: 'error',
      confirmButtonColor: '#99521c',
      confirmButtonText: 'Entendi',
      heightAuto: false,
    });
  }

  // 3. Alerta de Confirmação (Sim / Não)
  async confirmarAcao(titulo: string, mensagem: string): Promise<boolean> {
    const result = await Swal.fire({
      title: titulo,
      text: mensagem,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#99521c',
      cancelButtonColor: '#ccc',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    });

    return result.isConfirmed;
  }
}