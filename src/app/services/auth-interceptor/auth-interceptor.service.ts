import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url === environment.domain + '/user/login') return next.handle(req);


    let token = '';
    const profile = localStorage.getItem('profile')
    if (typeof profile === 'string' && profile) {
      token = JSON.parse(profile).token
    }

    const authRequest = req.clone({
      headers: req.headers.append(
        'Authorization',
        `Bearer ${token}`
      ),
    });
    return next.handle(authRequest);
  }
}
