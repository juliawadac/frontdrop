import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Adiciona o token de autenticação se existir
    const token = localStorage.getItem('token');
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Adiciona headers padrão
    request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Erro desconhecido';
        
        if (error.error instanceof ErrorEvent) {
          // Erro do lado cliente
          errorMessage = `Erro: ${error.error.message}`;
        } else {
          // Erro do lado servidor
          switch (error.status) {
            case 400:
              errorMessage = error.error?.error || error.error?.Mensagem || 'Dados inválidos';
              break;
            case 401:
              errorMessage = 'Não autorizado. Faça login novamente.';
              localStorage.removeItem('token');
              this.router.navigate(['/login']);
              break;
            case 403:
              errorMessage = 'Acesso negado';
              break;
            case 404:
              errorMessage = 'Recurso não encontrado';
              break;
            case 500:
              errorMessage = 'Erro interno do servidor';
              break;
            default:
              errorMessage = error.error?.error || error.error?.Mensagem || `Erro: ${error.status}`;
          }
        }

        console.error('HTTP Error:', {
          status: error.status,
          message: errorMessage,
          fullError: error
        });

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}