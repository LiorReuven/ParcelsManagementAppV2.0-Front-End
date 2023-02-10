import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//PrimeNG
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DividerModule} from 'primeng/divider';
import {MenubarModule} from 'primeng/menubar';
import {MessageModule} from 'primeng/message';
import {DataViewModule} from 'primeng/dataview';
import {PanelMenuModule} from 'primeng/panelmenu';
import {DialogModule} from 'primeng/dialog';
import {ToastModule} from 'primeng/toast';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import { TagModule } from 'primeng/tag';
import {AutoFocusModule} from 'primeng/autofocus';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { ChipModule } from 'primeng/chip';
import {ToolbarModule} from 'primeng/toolbar';
import {CheckboxModule} from 'primeng/checkbox';
import {ColorPickerModule} from 'primeng/colorpicker';
import {TooltipModule} from 'primeng/tooltip';
import {CalendarModule} from 'primeng/calendar';





@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    DividerModule,
    MenubarModule,
    MessageModule,
    DataViewModule,
    PanelMenuModule,
    DialogModule,
    ToastModule,
    DropdownModule,
    TableModule,
    TagModule,
    AutoFocusModule,
    ConfirmDialogModule,
    ChipModule,
    ToolbarModule,
    CheckboxModule,
    ColorPickerModule,
    TooltipModule,
    CalendarModule
    
  ],
  exports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    DividerModule,
    MenubarModule,
    MessageModule,
    DataViewModule,
    PanelMenuModule,
    DialogModule,
    ToastModule,
    DropdownModule,
    TableModule,
    TagModule,
    AutoFocusModule,
    ConfirmDialogModule,
    ChipModule,
    ToolbarModule,
    CheckboxModule,
    ColorPickerModule,
    TooltipModule,
    CalendarModule
    
  ],
  providers:[

  ]
})
export class PrimengModule { }
