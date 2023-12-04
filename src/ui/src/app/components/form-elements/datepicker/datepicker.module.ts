import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from './datepicker.component';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { IconsModule } from 'src/app/core/modules/icons.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IconsModule,
    NgbDatepickerModule,
  ],
  declarations: [
    DatepickerComponent,
  ],
  exports: [
    DatepickerComponent,
  ],
})

export class DatepickerModule {}
