import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { hasRequiredField } from 'src/app/core/utils/has-required-field';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})

export class TextareaComponent implements OnInit {

  @Input() name: string = "";
  @Input() label: string = "";
  @Input() control?: any = new FormControl("");
  @Input() placeholder = '';
  @Input() hint: string = "";
  @Input() rows: number = 3;

  ngOnInit(): void {}

  clear() {
    if(this.control) this.control.patchValue('');
  }

  get isRequired(): boolean {
    return hasRequiredField(this.control!);
  }

}
