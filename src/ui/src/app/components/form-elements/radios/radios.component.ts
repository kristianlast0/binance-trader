import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { hasRequiredField } from 'src/app/core/utils/has-required-field';

@Component({
  selector: 'app-radios',
  templateUrl: './radios.component.html',
  styleUrls: ['./radios.component.scss']
})

export class RadiosComponent implements OnInit {

  @Input() ngOptionTmp?: TemplateRef<any>;

  @Input() name: string = "";
  @Input() id: string = Math.floor(Math.random() * 1000000000).toString();
  @Input() label: string = "";
  @Input() control: any = new FormControl("");
  @Input() options: any[] = [];
  @Input() inline: boolean = false;
  @Input() textAttr: string = "name";

  ngOnInit(): void {}

  get isRequired(): boolean {
    return hasRequiredField(this.control);
  }

}
