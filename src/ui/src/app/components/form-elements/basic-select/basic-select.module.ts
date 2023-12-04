import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicSelectComponent } from './basic-select.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    ReactiveFormsModule,
  ],
  declarations: [
    BasicSelectComponent,
  ],
  exports: [
    BasicSelectComponent,
  ],
})

export class BasicSelectModule {}
