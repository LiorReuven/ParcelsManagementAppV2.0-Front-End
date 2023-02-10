import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {



  constructor(private messageService: MessageService) {}

  showError(detail: string) {
    this.messageService.add({severity:'error', summary: 'Error', detail:detail});
    let audio = new Audio()
    audio.src = '../assets/error.wav'
    audio.load()
    audio.play()
  }

  showSucess(detail: string) {
    this.messageService.add({severity:'success', summary:'Success', detail:detail});
    let audio = new Audio()
    audio.src = '../assets/success.wav'
    audio.load()
    audio.play()
  }

}