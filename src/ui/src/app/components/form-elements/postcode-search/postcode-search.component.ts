import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/services/api.service';
import { Address } from 'src/app/models/address.model';

@Component({
  selector: 'app-postcode-search',
  templateUrl: './postcode-search.component.html',
  styleUrls: ['./postcode-search.component.scss']
})

export class PostcodeSearchComponent implements OnInit, OnDestroy {

  @Output() onSelected = new EventEmitter<any>();

  loading = false;
  loaded: boolean = false;
  searched: string = "";
  addresses: Address[] = [];
  selected: FormControl = new FormControl();
  error: string | null = null;

  @Input() label: string = 'Postcode';
  @Input() placeholder: string = 'Enter a postcode';
  @Input() name: string = 'postcode';
  @Input() control: any;

  constructor(
    private api: ApiService,
    private toastr: ToastrService) {}

  ngOnInit() {}

  search() {
    if(this.control.value == "") return;
    this.api.post('/postcode-lookups', { postcode: this.control.value }).subscribe({
      next: (response: any) => {
        console.log(response);
        this.selected.setValue(null);
        this.searched = this.control.value;
        this.addresses = response.data;
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

  emit() {
    this.onSelected.emit(this.selected.value);
  }

  ngOnDestroy() {
    this.loaded = false;
  }

}