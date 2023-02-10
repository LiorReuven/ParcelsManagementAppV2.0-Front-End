import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingErrorService {
  isLoading$ = new BehaviorSubject<boolean>(false);
  error$ = new Subject<string | null>();

  constructor() { }
}
