import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/services/api.service';
import { Address } from 'src/app/models/address.model';
import { Business } from 'src/app/models/business.model';

@Component({
  selector: 'app-company-search',
  templateUrl: './company-search.component.html',
  styleUrls: ['./company-search.component.scss']
})

export class CompanySearchComponent implements OnInit, OnDestroy {

  @Output() onSelected = new EventEmitter<any>();

  loading = false;
  loaded: boolean = false;
  searched: string = "";
  error: string | null = null;

  @Input() label: string = 'Company';
  @Input() placeholder: string = 'Company number';
  @Input() name: string = 'company_number';
  @Input() control: any;

  constructor(
    private api: ApiService,
    private toastr: ToastrService) {}

  ngOnInit() {}

  search() {
    if(this.control.value == "") return;
    this.api.post('/company-lookups', { company_number: this.control.value }).subscribe({
      next: (response: any) => {
        console.log(response);
        this.searched = this.control.value;
        this.onSelected.emit(response.data);
      },
      error: (response: any) => {
        this.toastr.error(response.error.message, 'Error');
        if (response.status === 403) this.error = response.error.message;
        if (response.status === 422) {
          for (const field in response.error.errors) {
            if(field == 'registration') {
              this.control.setErrors({ server: response.error.errors[field][0] });
              this.control.markAsTouched();
            }
          }
        }
      },
    });
  }

  ngOnDestroy() {
    this.loaded = false;
  }

}