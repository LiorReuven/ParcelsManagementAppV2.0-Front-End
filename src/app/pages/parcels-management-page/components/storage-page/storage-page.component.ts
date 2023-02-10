import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Parcel } from 'src/app/models/Parcel.model';
import { Storage } from 'src/app/models/Storage.model';
import { ParcelsService } from 'src/app/services/parcels/parcels.service';

@Component({
  selector: 'app-storage-page',
  templateUrl: './storage-page.component.html',
  styleUrls: ['./storage-page.component.css'],
})
export class StoragePageComponent implements OnInit, OnDestroy {
  storageParcels: Parcel[] = [];
  stockParcels: Parcel[] = [];
  storage!: Storage;
  private ngUnsubscribe = new Subject<void>();
  modalParcel!:Parcel;
  actionsModalTitle!:string;
  actionsDisplayModal!:boolean;
  releaseModalTitle!:string;
  releaseDisplayModal!:boolean;

  constructor(
    private parcelsService: ParcelsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.storage = {
      name: this.route.snapshot.params['name'],
      position: this.route.snapshot.params['position'],
      color: this.route.snapshot.params['color'],
    };

    this.parcelsService.stockParcels$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        this.stockParcels = response;
        this.storageParcels = this.stockParcels.filter((stockParcel) => {
          return stockParcel.position === this.storage.name;
        });
      });
    
  }

  onActionsClick(parcel: Parcel) {
    this.modalParcel = parcel
    this.actionsModalTitle = 'Parcels Actions'
    this.actionsDisplayModal = true

      }

  onActionsHideModal() {
  this.actionsDisplayModal = false;
  }

  onReleaseClick(parcel: Parcel) {
    this.modalParcel = parcel
    this.releaseModalTitle = 'Release Parcel'
    this.releaseDisplayModal = true
  }

  onReleaseHideModal() {
    this.releaseDisplayModal = false;
    }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
