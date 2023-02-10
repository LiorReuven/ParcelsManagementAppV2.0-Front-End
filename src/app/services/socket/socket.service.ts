import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { io } from "socket.io-client";
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {
  isSocketInit$ = new BehaviorSubject<boolean>(false);
  socket:any;
  userSub:Subscription;
  readonly url:string = environment.socketDomain

  constructor(private authService:AuthService) {
    this.userSub = this.authService.user.subscribe({next: (response) => {
      if (!!response) {
        this.socket = io(this.url)
        this.isSocketInit$.next(true)
      } else {
        if (this.socket) {
          this.socket.disconnect()
        }
      }
    }})
   }

   listen(eventName:string) {

    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data)
      })
    })

   }

   emit(eventName:string,data:any) {
    this.socket.emit(eventName, data)
   }



   ngOnDestroy(): void {
     this.userSub.unsubscribe()
   }
}
