import {
  Attribute,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef, HostBinding,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {isDefined} from '../utils';
import { AngularEditorService } from '../angular-editor.service';

export interface TagData {
  key: string;
  name: string;
  tags: object;
  type: string;
}

@Component({
  selector: 'ae-tag-select',
  templateUrl: './ae-tag-select.component.html',
  styleUrls: ['./ae-tag-select.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class AeTagSelectComponent implements OnInit {

  @Output('onSelect') onSelect = new EventEmitter();

  @Input('hidden') isHidden: boolean = false;
  @Input('data') data?: TagData;
  @Input('disabled') disabled: boolean = false;

  optionId = 0;
  opened = false;

  @HostBinding('style.display') hidden = 'inline-block';
  @ViewChild('labelButton', {static: true}) labelButton?: ElementRef;

  constructor(private elRef: ElementRef,
              private r: Renderer2,
              private editorService: AngularEditorService,
  ) {}

  ngOnInit() {
    if (isDefined(this.isHidden) && this.isHidden) {
      this.hide();
    }
  }

  hide() {
    this.hidden = 'none';
  }

  optionSelect(key: any, event: MouseEvent) {
    event.stopPropagation();
    console.log(key);
    let html = '['+this.data!.key+'.'+key+']';
    this.onSelect.emit(html);
    this.opened = false;
  }

  toggleOpen(event: MouseEvent) {
    // event.stopPropagation();
    if (this.disabled) {
      return;
    }
    this.opened = !this.opened;
  }

  @HostListener('document:click', ['$event'])
  onClick($event: MouseEvent) {
    if (!this.elRef.nativeElement.contains($event.target)) this.close();
  }

  close() {
    this.opened = false;
  }

  get isOpen(): boolean {
    return this.opened;
  }

  setDisabledState(isDisabled: boolean): void {
    this.labelButton!.nativeElement.disabled = isDisabled;
    const div = this.labelButton!.nativeElement;
    const action = isDisabled ? 'addClass' : 'removeClass';
    this.r[action](div, 'disabled');
    this.disabled = isDisabled;
  }
 
}
