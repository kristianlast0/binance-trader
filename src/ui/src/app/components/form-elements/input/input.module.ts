import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IconsModule } from 'src/app/core/modules/icons.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconsModule,
  ],
  declarations: [
    InputComponent,
  ],
  exports: [
    InputComponent,
  ],
})

export class InputModule {}
