import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { SearchSelectComponent } from './search-select.component';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
  ],
  declarations: [
    SearchSelectComponent,
  ],
  exports: [
    SearchSelectComponent,
  ],
  providers: [
    ApiService
  ]
})

export class SearchSelectModule {}
