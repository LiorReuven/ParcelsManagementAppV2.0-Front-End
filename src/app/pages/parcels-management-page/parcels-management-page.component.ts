import { Component, OnDestroy, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import { Subscription } from 'rxjs';
import { ParcelsService } from 'src/app/services/parcels/parcels.service';

@Component({
  selector: 'app-parcels-management-page',
  templateUrl: './parcels-management-page.component.html',
  styleUrls: ['./parcels-management-page.component.css'],
})
export class ParcelsManagementPageComponent implements OnInit {

  items!: MenuItem[];


  constructor(private parcelService: ParcelsService) {}

  ngOnInit(): void {


    this.items = [{
      label: 'Dashboard',
      routerLink: ['/parcels-management', 'parcels-dashboard']

    },
      {
          label: 'Actions',
          items: [{
              label: 'Recieve Parcels',
              icon: 'pi pi-folder-open',
              routerLink: ['/parcels-management', 'recieve-parcels']
          },
          {
              label: 'Update Parcels',
              icon: 'pi pi-replay',
              routerLink: ['/parcels-management', 'update-parcels']
          }
      ]}
  ];

  }

}
