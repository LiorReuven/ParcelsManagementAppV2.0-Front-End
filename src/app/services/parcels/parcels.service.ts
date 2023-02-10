import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { Parcel } from 'src/app/models/Parcel.model';
import { environment } from 'src/environments/environment';
import { SocketService } from '../socket/socket.service';

@Injectable({
  providedIn: 'root',
})
export class ParcelsService {
  allParcels$ = new BehaviorSubject<Parcel[]>([]);
  stockParcels$ = new BehaviorSubject<Parcel[]>([]);
  isLoading$ = new BehaviorSubject<boolean>(true);
  error$ = new Subject<string | null>();
  stockParcels: Parcel[] = [];
  allParcels: Parcel[] = [];
  lastHandledParcel$ = new BehaviorSubject<Parcel | null>(null);

  constructor(private http: HttpClient, private socketService:SocketService) {}


  fetchParcels() {
    return this.http.get<Parcel[]>(`${environment.domain}/parcels`).pipe(tap({
      next: (response) => {
        this.allParcels = response;
        this.allParcels$.next([...this.allParcels]);

        //may only filter on specific page
        this.stockParcels = response.filter(
          (parcel) => parcel.isOnStock === true
        );
        this.stockParcels$.next([...this.stockParcels]);
        //may only filter on specific page

        this.isLoading$.next(false);
      },
      error: (err) => {
        if (err.error.message) {
          this.error$.next(err.error.message);
        } else {
          this.error$.next('Unknown server error');
        }
      },
    }))
  }


  unstockParcel(parcel: Parcel) {
    return this.http
      .patch<{ updatedParcel: Parcel | null; message: string }>(
        `${environment.domain}/parcels/unstock`,
        {
          parcel,
        }
      )
      .pipe(
        tap({
          next: (response) => {
            if (response.updatedParcel) {
              this.unstockParcelLocal(response.updatedParcel);
              this.socketService.emit('unstockParcel', response.updatedParcel)
            }
          },
          complete: () => {},
        })
      );
  }

  createParcel(parcel: { barcode: string; position: string; company: string }) {
    return this.http
      .post<{ newParcel: Parcel | null; message: string }>(
        `${environment.domain}/parcels`,
        {
          parcel,
        }
      )
      .pipe(
        tap({
          next: (response) => {
            if (response.newParcel) {
              this.createParcelLocal(response.newParcel);
              this.socketService.emit('createParcel', response.newParcel)
            }
          },
        })
      );
  }

  updateParcel(parcel: { barcode: string; position: string; company: string }) {
    return this.http
      .patch<{ updatedParcel: Parcel | null; message: string }>(
        `${environment.domain}/parcels`,
        {
          parcel,
        }
      )
      .pipe(
        tap({
          next: (response) => {
            if (response.updatedParcel) {
              this.updateParcelLocal(response.updatedParcel);
              this.socketService.emit('updateParcel', response.updatedParcel)
            }
          },
        })
      );
  }

  deleteParcel(parcel: Parcel) {
    return this.http
      .put<{ deletedParcel: Parcel | null; message: string }>(
        `${environment.domain}/parcels/delete`,
        {
          parcel,
        }
      )
      .pipe(
        tap({
          next: (response) => {
            if (response.deletedParcel) {
              this.deleteParcelLocal(response.deletedParcel);
              this.socketService.emit('deleteParcel', response.deletedParcel)
            }
          },
          complete: () => {},
        })
      );
  }

  returnParcel(parcel:Parcel) {
    return this.http
    .patch<{ updatedParcel: Parcel | null; message: string }>(
      `${environment.domain}/parcels/return`,
      {
        parcel,
      }
    )
    .pipe(
      tap({
        next: (response) => {
          if (response.updatedParcel) {
            this.unstockParcelLocal(response.updatedParcel);
            this.socketService.emit('unstockParcel', response.updatedParcel)
          }
        },
        complete: () => {},
      })
    );
  }

  unlockReturnsParcel(parcel:Parcel) {
    return this.http
    .patch<{ updatedParcel: Parcel | null; message: string }>(
      `${environment.domain}/parcels/unlock-returns`,
      {
        parcel,
      }
    )
    .pipe(
      tap({
        next: (response) => {
          if (response.updatedParcel) {
            this.updateParcelLocal(response.updatedParcel);
            this.socketService.emit('updateParcel', response.updatedParcel)
          }
        },
        complete: () => {},
      })
    );
  }

  lockReturnsParcel(parcel:Parcel) {
    return this.http
    .patch<{ updatedParcel: Parcel | null; message: string }>(
      `${environment.domain}/parcels/lock-returns`,
      {
        parcel,
      }
    )
    .pipe(
      tap({
        next: (response) => {
          if (response.updatedParcel) {
            this.updateParcelLocal(response.updatedParcel);
            this.socketService.emit('updateParcel', response.updatedParcel)

          }
        },
        complete: () => {},
      })
    );
  }

  deleteParcelLocal(parcel: Parcel) {
    //stock
    const stockIndex = this.stockParcels.findIndex((stockParcel) => {
      return stockParcel._id === parcel._id;
    });
    if (stockIndex === -1) {
      //do nothing
    } else {
      this.stockParcels.splice(stockIndex, 1);
      this.stockParcels$.next([...this.stockParcels]);
    }

    //all
    const allIndex = this.allParcels.findIndex((allParcel) => {
      return allParcel._id === parcel._id;
    });
    if (allIndex === -1) {
      //do nothing
    } else {
      this.allParcels.splice(allIndex, 1);
      this.allParcels$.next([...this.allParcels]);
    }

    this.lastHandledParcel$.next(null)
  }

  updateParcelLocal(parcel: Parcel) {
    //stock
    const stockIndex = this.stockParcels.findIndex((stockParcel) => {
      return stockParcel._id === parcel._id;
    });
    if (stockIndex === -1) {
      //do nothing
    } else {
      this.stockParcels.splice(stockIndex, 1, parcel);
      this.stockParcels$.next([...this.stockParcels]);
    }

    //all
    const allIndex = this.allParcels.findIndex((allParcel) => {
      return allParcel._id === parcel._id;
    });
    if (allIndex === -1) {
      //do nothing
    } else {
      this.allParcels.splice(allIndex, 1, parcel);
      this.allParcels$.next([...this.allParcels]);
    }


    this.lastHandledParcel$.next(parcel)
  }

  unstockParcelLocal(parcel: Parcel) {
    //stock
    const stockIndex = this.stockParcels.findIndex((stockParcel) => {
      return stockParcel._id === parcel._id;
    });
    if (stockIndex === -1) {
      //do nothing
    } else {
      this.stockParcels.splice(stockIndex, 1);
      this.stockParcels$.next([...this.stockParcels]);
    }

    //all
    const allIndex = this.allParcels.findIndex((allParcel) => {
      return allParcel._id === parcel._id;
    });
    if (allIndex === -1) {
      //do nothing
    } else {
      this.allParcels.splice(allIndex, 1, parcel);
      this.allParcels$.next([...this.allParcels]);
    }


    
  }

  createParcelLocal(parcel: Parcel) {
    //stock
    this.stockParcels.push(parcel);
    this.stockParcels$.next([...this.stockParcels]);
    //all
    this.allParcels.push(parcel);
    this.allParcels$.next([...this.allParcels]);



    this.lastHandledParcel$.next(parcel)
  }

}
