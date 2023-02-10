import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Parcel } from 'src/app/models/Parcel.model';
import { Storage } from 'src/app/models/Storage.model';
import { ParcelsService } from 'src/app/services/parcels/parcels.service';
import { StoragesService } from 'src/app/services/storages/storages.service';

type listItem = {
  storage: string
  company:string
  color:string
}


@Component({
  selector: 'app-storages-list',
  templateUrl: './storages-list.component.html',
  styleUrls: ['./storages-list.component.css']
})
export class StoragesListComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  allStorages: Storage[] = []
  stockParcels: Parcel[] = []
  listArray: listItem[] = []

  constructor(private parcelsService: ParcelsService, private storagesService:StoragesService) {}

  ngOnInit(): void {
    this.parcelsService.stockParcels$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        this.stockParcels = response;
        this.listArray = this.allStorages.map((storage) => {
          const foundParcel = this.stockParcels.find((parcel) => {
            return parcel.position === storage.name
          })
          if (!foundParcel) {
            return {storage: storage.name, company: 'None', color:storage.color}
          } else {
            return {storage: storage.name, company: foundParcel.company, color:storage.color}
          }
         })
      });

    this.storagesService.allStorages$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        this.allStorages = response;
        this.listArray = this.allStorages.map((storage) => {
          const foundParcel = this.stockParcels.find((parcel) => {
            return parcel.position === storage.name
          })
          if (!foundParcel) {
            return {storage: storage.name, company: 'None', color:storage.color}
          } else {
            return {storage: storage.name, company: foundParcel.company, color:storage.color}
          }
         })
      });

       
  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
