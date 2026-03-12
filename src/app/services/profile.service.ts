import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private photoSubject = new BehaviorSubject<string | null>(null);

  /** Observable que qualquer página pode assinar para receber a foto atual */
  photo$ = this.photoSubject.asObservable();

  constructor(private authService: AuthService) {
    // Sempre que o usuário logado mudar, recarrega a foto correta
    this.authService.currentUser$.subscribe(user => {
      if (user?.id) {
        const foto = localStorage.getItem(this.storageKey(user.id));
        this.photoSubject.next(foto);
      } else {
        // Sem usuário logado → limpa a foto exibida
        this.photoSubject.next(null);
      }
    });
  }

  /** Chave única por usuário: ex. "profilePhoto_42" */
  private storageKey(userId: number): string {
    return `profilePhoto_${userId}`;
  }

  /** ID do usuário atualmente logado */
  private getCurrentUserId(): number | null {
    return this.authService.currentUser$
      ? (this.authService as any).currentUserSubject?.getValue()?.id ?? null
      : null;
  }

  /** Salva a foto (base64) vinculada ao usuário logado e notifica subscribers */
  setPhoto(base64: string) {
    const userId = this.getCurrentUserId();
    if (!userId) return;

    localStorage.setItem(this.storageKey(userId), base64);
    this.photoSubject.next(base64);
  }

  /** Remove a foto do usuário logado */
  clearPhoto() {
    const userId = this.getCurrentUserId();
    if (userId) {
      localStorage.removeItem(this.storageKey(userId));
    }
    this.photoSubject.next(null);
  }

  /** Retorna a foto atual (síncrono) */
  getPhoto(): string | null {
    return this.photoSubject.getValue();
  }
}