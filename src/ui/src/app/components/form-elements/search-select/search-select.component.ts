import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subject, catchError, concat, debounceTime, of, switchMap, tap } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-search-select',
  templateUrl: './search-select.component.html',
  styleUrls: ['./search-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: SearchSelectComponent,
    multi: true
  }]
})

export class SearchSelectComponent implements ControlValueAccessor, OnInit {

  @Input() ngOptionTmp?: TemplateRef<any>;
  @Input() ngButtonTmp?: TemplateRef<any>;

  public data$: Observable<any> | undefined;
  public input$ = new Subject<string>();
  public required: boolean = false;
  public loaded: boolean = false;

  @Input() name: string = "";
  @Input() label: string = "";
  @Input() loading: boolean = false;
  @Input() filters: any = { search: "" };
  @Input() valueAttr: string = "id";
  @Input() textAttr: string = "name";
  @Input() multiple: boolean = false;
  @Input() endpoint: string = "";

  selectedValue: any;

  constructor(private api: ApiService) {}

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}

  ngOnInit() {
    this.loadData();
  }

  public initSearch() {
    if(!this.loaded) this.input$.next(this.filters.search);
    this.loaded = true;
  }

  selectOption(option: any) {
    this.selectedValue = option;
    this.onChange(this.selectedValue);
    this.onTouched();
  }

  private loadData() {
    console.log(this.filters);
    this.data$ = concat(
      of([]),
      this.input$.pipe(
        debounceTime(400),
        tap(() => this.loading = true),
        switchMap((term: any) => {
          this.filters.search = term;
          return this.api.get(this.endpoint, this.filters).pipe(
            switchMap((response: any) => of(response.data)),
            catchError(() => of([])),
            tap(() => this.loading = false)
          );
        })
      )
    );
  }

}
