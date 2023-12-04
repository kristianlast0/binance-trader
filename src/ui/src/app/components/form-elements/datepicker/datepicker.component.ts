import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
  ],
})

export class DatepickerComponent implements ControlValueAccessor, OnInit {

  @Input() control: any;
  @Input() name: string = "";
  @Input() label: string = "";
  @Input() placeholder: string = 'Choose a date';
  
  selectedDate: NgbDate | null = null;

  constructor(private ngbDateParserFormatter: NgbDateParserFormatter) {}

  ngOnInit(): void {}

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    if(value) {
      const dateParts = value.split('-');
      this.selectedDate = new NgbDate(Number(dateParts[0]), Number(dateParts[1]), Number(dateParts[2]));
    }
    else this.selectedDate = null;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}

  onDateSelect(date: any) {
    this.selectedDate = date;
    this.onChange(this.ngbDateParserFormatter.format(date));
    this.onTouched();
  }

}