import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostcodeSearchComponent } from './postcode-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BasicSelectModule } from '../basic-select/basic-select.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    BasicSelectModule,
  ],
  declarations: [
    PostcodeSearchComponent,
  ],
  exports: [
    PostcodeSearchComponent,
  ]
})

export class PostcodeSearchModule {}
