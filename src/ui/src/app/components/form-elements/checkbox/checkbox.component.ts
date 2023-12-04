import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { hasRequiredField } from 'src/app/core/utils/has-required-field';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})

export class CheckboxComponent implements OnInit {

  @Input() name: string = "";
  @Input() class: string = "primary";
  @Input() id: string = Math.floor(Math.random() * 1000000000).toString();
  @Input() label: string = "";
  @Input() control: any = new FormControl("");
  @Input() hint: string = "";

  ngOnInit(): void {}

  get isRequired(): boolean {
    return hasRequiredField(this.control!);
  }

}