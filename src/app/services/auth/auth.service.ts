import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/User.model';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http
      .post<User>(`${environment.domain}/user/login`, { username, password })
      .pipe(
        tap({
          next: (resData) => {
            let tokenExpiration: string | Date = new Date();
            tokenExpiration.setDate(tokenExpiration.getDate() + 3);

            const user = new User(resData._id, resData.token, tokenExpiration);
            this.autoLogout(tokenExpiration.getTime() - new Date().getTime())
            const stringTokenExpiration = tokenExpiration.toString();
            localStorage.setItem(
              'profile',
              JSON.stringify({
                ...user,
                tokenExpiration: stringTokenExpiration,
              })
            );
            this.user.next(user);
          },
        })
      );
  }

  autoLogin() {
    const profile = localStorage.getItem('profile');
    if (!profile) {
      return;
    }
    const userData: User = JSON.parse(profile);
    const loadedUser = new User(
      userData._id,
      userData.token,
      new Date(userData.tokenExpiration)
    );
    if (loadedUser.tokenValue) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData.tokenExpiration).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('profile');
    this.router.navigate(['/login']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}
