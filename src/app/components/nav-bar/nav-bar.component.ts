import { Component, OnDestroy, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {
   items!: MenuItem[];
   isAuth: boolean = false
   authSub!: Subscription;

   constructor(private authService: AuthService) {}

  ngOnInit() {

    this.authSub = this.authService.user.subscribe((user) => {
        this.isAuth = !!user
    })


    this.items = [
        {
            label:'Parcels Manager',
            routerLink: ['/parcels-management'],
        },
        {
            label:'Search',
            routerLink: ['/search-parcels']
        },
        {
            label:'Storages',
            routerLink: ['/storages-management']
            // icon:'pi pi-fw pi-user',
        },
        {
            label:'Companies',
            routerLink: ['/companies-management']      
        },
        {
            label:'Reports',
            routerLink: ['/reports']      
        },
    
    ];
}

onLogoutClick() {
    this.authService.logout()
}

ngOnDestroy(): void {
    this.authSub.unsubscribe()
}

}
