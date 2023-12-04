import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { hasRequiredField } from 'src/app/core/utils/has-required-field';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})

export class InputComponent implements OnInit {

  public required: boolean = false;

  @Input() name: string = "";
  @Input() label: string = "";
  @Input() control?: any = new FormControl();
  @Input() type: string = "text";
  @Input() format: string = "text"; // text/currency/date
  @Input() placeholder = '';
  @Input() errors: any = null;
  @Input() prepend: string = "";
  @Input() append: string = "";
  @Input() step: number = 1;
  @Input() min: number = 0;
  @Input() max: number = 99999999999;

  ngOnInit(): void {
    this.required = hasRequiredField(this.control);
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) this.control.disable();
    else this.control.enable();
  }

  clear() {
    this.control.patchValue('');
  }

}
