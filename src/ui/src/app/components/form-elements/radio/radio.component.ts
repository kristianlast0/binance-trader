import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { hasRequiredField } from 'src/app/core/utils/has-required-field';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})

export class RadioComponent implements OnInit {

  @Input() id: string = Math.floor(Math.random() * 1000000000).toString();
  @Input() control: any = new FormControl("");
  @Input() value: any = "";
  @Input() name: string = "";

  ngOnInit(): void {}

  get isRequired(): boolean {
    return hasRequiredField(this.control!);
  }

}