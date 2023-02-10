import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Storage } from 'src/app/models/Storage.model';
import { environment } from 'src/environments/environment';
import { SocketService } from '../socket/socket.service';

@Injectable({
  providedIn: 'root',
})
export class StoragesService {
  allStorages$ = new BehaviorSubject<Storage[]>([]);
  allStorages: Storage[] = [];

  constructor(private http: HttpClient, private socketService: SocketService) {}

  fetchStorages() {
    return this.http
      .get<{ allStorages: Storage[] }>(`${environment.domain}/storages`)
      .pipe(
        tap({
          next: (response) => {
            this.allStorages = response.allStorages;
            this.allStorages$.next([...this.allStorages]);
          },
        })
      );
  }

  createStorage(storage: Storage) {
    return this.http
      .post<{ updatedStorages: Storage[] | null; message: string }>(
        `${environment.domain}/storages`,
        {
          storage,
        }
      )
      .pipe(
        tap({
          next: (response) => {
            if (
              response.updatedStorages &&
              response.updatedStorages?.length > 0
            ) {
              this.createStorageLocal(response.updatedStorages);
              this.socketService.emit(
                'createStorage',
                response.updatedStorages
              );
            }
          },
          complete: () => {},
        })
      );
  }

  updateStorage(storage: Storage) {
    return this.http
      .patch<{ updatedStorages: Storage[] | null; message: string }>(
        `${environment.domain}/storages`,
        {
          storage,
        }
      )
      .pipe(
        tap({
          next: (response) => {
            if (
              response.updatedStorages &&
              response.updatedStorages?.length > 0
            ) {
              this.updateStorageLocal(response.updatedStorages);
              this.socketService.emit(
                'updateStorage',
                response.updatedStorages
              );
            }
          },
          complete: () => {},
        })
      );
  }

  deleteStorage(storage: Storage) {
    return this.http
      .post<{ updatedStorages: Storage[] | null; message: string }>(
        `${environment.domain}/storages/delete`,
        {
          storage,
        }
      )
      .pipe(
        tap({
          next: (response) => {
            if (
              response.updatedStorages &&
              response.updatedStorages?.length > 0
            ) {
              this.deleteStorageLocal(response.updatedStorages);
              this.socketService.emit(
                'deleteStorage',
                response.updatedStorages
              );
            }
          },
          complete: () => {},
        })
      );
  }

  updateStorageLocal(storages: Storage[]) {
    this.allStorages$.next([...storages]);
  }

  createStorageLocal(storages: Storage[]) {
    this.allStorages$.next([...storages]);
  }
  deleteStorageLocal(storages: Storage[]) {
    this.allStorages$.next([...storages]);
  }
}
