import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, UntypedFormControl } from '@angular/forms';
import { hasRequiredField } from 'src/app/core/utils/has-required-field';

@Component({
  selector: 'app-basic-select',
  templateUrl: './basic-select.component.html',
  styleUrls: ['./basic-select.component.scss'],
})

export class BasicSelectComponent implements OnInit, OnChanges {

  @Input() ngOptionTmp?: TemplateRef<any>;

  @Input() name: string = "";
  @Input() label: string = "";
  @Input() control: any = new FormControl("");
  @Input() placeholder = 'Select an option';
  @Input() hint: string = "";
  @Input() prepend: string = "";
  @Input() valueAttr: string = "id";
  @Input() textAttr: string = "name";
  @Input() multiple: boolean = false;
  @Input() options: Array<object> = [];

  public required: boolean = false;
  public string_options: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) this.options = [...changes['options'].currentValue];
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) this.control.disable();
    else this.control.enable();
  }

  ngOnInit(): void {
    if (typeof this.options[0] === 'string') this.string_options = true;
    this.required = hasRequiredField(this.control);
  }

  getValue(option: any) {
    if (this.string_options) return option;
    return option[this.valueAttr];
  }

  getText(option: any) {
    if (this.string_options) return option;
    return option[this.textAttr];
  }

  clear() {
    this.control.patchValue('');
  }

}
