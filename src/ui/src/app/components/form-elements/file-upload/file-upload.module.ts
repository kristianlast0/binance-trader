import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IconsModule } from 'src/app/core/modules/icons.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconsModule,
  ],
  declarations: [
    FileUploadComponent,
  ],
  exports: [
    FileUploadComponent,
  ],
})

export class FileUploadModule {}
