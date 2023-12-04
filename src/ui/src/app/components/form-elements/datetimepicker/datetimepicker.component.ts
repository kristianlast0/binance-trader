import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-datetimepicker',
  templateUrl: './datetimepicker.component.html',
  styleUrls: ['./datetimepicker.component.scss'],
})

export class DatetimepickerComponent implements OnInit, OnChanges {

  @ViewChild('datetimePicker', { static: true }) datetimePicker!: ElementRef<any>;

  @Input() control: any = new FormControl();
  @Input() name: string = "";
  @Input() label: string = "";
  @Input() time: boolean = false;
  @Input() placeholder: string = 'Choose a date'+(this.time ? ' and time' : '')+'...';
  @Input() disabled_dates: any[] = [];
  @Input() format: string = this.time ? 'Y-m-d H:i' : 'Y-m-d';

  constructor() {}

  ngOnInit(): void {
    flatpickr(this.datetimePicker.nativeElement, {
      enableTime: this.time,
      dateFormat: this.format,
      weekNumbers: true,
      minuteIncrement: 10,
      time_24hr: false,
      disable: this.disabled_dates,
    });
  }

  ngOnChanges(): void {
    flatpickr(this.datetimePicker.nativeElement, {
      enableTime: this.time,
      dateFormat: this.format,
      weekNumbers: true,
      minuteIncrement: 10,
      time_24hr: false,
      disable: this.disabled_dates,
    });
  }

  setDisabledState(isDisabled: boolean): void {}

  // onDateSelect(date: any) {
  //   this.selectedDate = date;
  //   this.onChange(this.ngbDateParserFormatter.format(date));
  //   this.onTouched();
  // }

}