import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadiosComponent } from './radios.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [
    RadiosComponent,
  ],
  exports: [
    RadiosComponent,
  ],
})

export class RadiosModule {}
