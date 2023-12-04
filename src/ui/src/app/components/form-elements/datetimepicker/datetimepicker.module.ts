import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatetimepickerComponent } from './datetimepicker.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DatetimepickerComponent,
  ],
  exports: [
    DatetimepickerComponent,
  ],
})

export class DatetimepickerModule {}
