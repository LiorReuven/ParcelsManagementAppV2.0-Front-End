import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Parcel } from 'src/app/models/Parcel.model';
import { Storage } from 'src/app/models/Storage.model';
import { ParcelsService } from 'src/app/services/parcels/parcels.service';

@Component({
  selector: 'app-storage-box',
  templateUrl: './storage-box.component.html',
  styleUrls: ['./storage-box.component.css'],
})
export class StorageBoxComponent implements OnChanges, OnInit,OnDestroy {
  @Input() selectedStorage!: Storage;
  @Input() stockParcels: Parcel[] = [];
  @Input() isUpdateMode?:boolean
  @Output() storageCompanyFunc = new EventEmitter<string>();
  storageParcels: Parcel[] = [];
  storageCompany: string = '';
  lastHandledParcel: Parcel | null = null;
 

  displayModal: boolean = false;
  modalTitle: string = '';
  modalParcel!: Parcel;

  private ngUnsubscribe = new Subject<void>();

  constructor(private parcelsService: ParcelsService) {}

  ngOnInit(): void {
    this.parcelsService.lastHandledParcel$.next(null)

    
    this.parcelsService.lastHandledParcel$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        this.lastHandledParcel = response;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedStorage'] || changes['stockParcels']) {
      this.storageParcels = this.stockParcels.filter((stockParcel) => {
        return stockParcel.position === this.selectedStorage.name;
      });

      if (this.storageParcels.length < 1) {
        this.storageCompany = 'None';
        this.storageCompanyFunc.emit(this.storageCompany);
        return;
      } else {
        this.storageCompany = this.storageParcels[0].company;
        this.storageCompanyFunc.emit(this.storageCompany);
      }
    }

    if (changes['selectedStorage'] || changes['isUpdateMode']) {
      this.parcelsService.lastHandledParcel$.next(null)
    }
  }

  onLastHandledClick(lastHandledParcel: Parcel) {
    this.modalParcel = lastHandledParcel
    this.modalTitle = 'Parcels Actions'
    this.displayModal = true
  }

  onHideModal() {
    this.displayModal = false;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
