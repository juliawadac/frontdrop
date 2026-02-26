import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly STORAGE_KEY = 'profilePhoto';

  private photoSubject = new BehaviorSubject<string | null>(
    localStorage.getItem(this.STORAGE_KEY)
  );

  /** Observable que qualquer página pode assinar para receber a foto atual */
  photo$ = this.photoSubject.asObservable();

  /** Salva a foto (base64) e notifica todos os subscribers */
  setPhoto(base64: string) {
    localStorage.setItem(this.STORAGE_KEY, base64);
    this.photoSubject.next(base64);
  }

  /** Remove a foto */
  clearPhoto() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.photoSubject.next(null);
  }

  /** Retorna a foto atual (síncrono) */
  getPhoto(): string | null {
    return this.photoSubject.getValue();
  }
}