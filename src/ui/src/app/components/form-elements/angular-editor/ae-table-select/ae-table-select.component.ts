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

export interface TableSelectOption {
  row: number;
  col: number;
}

@Component({
  selector: 'ae-table-select',
  templateUrl: './ae-table-select.component.html',
  styleUrls: ['./ae-table-select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AeTableSelectComponent),
      multi: true,
    }
  ]
})

export class AeTableSelectComponent implements OnInit, ControlValueAccessor {

  @Input('hidden') isHidden: boolean = false;

  selectedOption: TableSelectOption = { row: -1, col: -1 };
  disabled = false;
  optionId = 0;

  rows = Array.from({length: 10}, (_, i) => i + 1);
  cols = Array.from({length: 10}, (_, i) => i + 1);
  hoveredCell: {row: number, col: number} = {row: -1, col: -1};

  get label(): string {
    return 'Table'
  }

  opened = false;

  get value(): object {
    return this.selectedOption;
  }

  @HostBinding('style.display') hidden = 'inline-block';

  // eslint-disable-next-line @angular-eslint/no-output-native, @angular-eslint/no-output-rename
  @Output('change') changeEvent = new EventEmitter();

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

  optionSelect(option: TableSelectOption, event: MouseEvent) {
    event.stopPropagation();
    this.setValue(option);
    this.onChange(this.selectedOption);
    this.changeEvent.emit(this.selectedOption);
    this.onTouched();
    this.opened = false;
  }

  toggleOpen(event: MouseEvent) {
    this.editorService.saveSelection();
    // event.stopPropagation();
    if (this.disabled) {
      return;
    }
    this.opened = !this.opened;
  }

  @HostListener('document:click', ['$event'])
  onClick($event: MouseEvent) {
    if (!this.elRef.nativeElement.contains($event.target)) {
      this.close();
    }
  }

  close() {
    this.opened = false;
  }

  get isOpen(): boolean {
    return this.opened;
  }

  writeValue(value: any) {
    if (!value || typeof value !== 'string') {
      return;
    }
    this.setValue(value);
  }

  setValue(value: any) {
    let index = 0;
    this.selectedOption = value;
  }

  onChange: any = () => {
  }
  onTouched: any = () => {
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.labelButton!.nativeElement.disabled = isDisabled;
    const div = this.labelButton!.nativeElement;
    const action = isDisabled ? 'addClass' : 'removeClass';
    this.r[action](div, 'disabled');
    this.disabled = isDisabled;
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown($event: KeyboardEvent) {
    if (!this.opened) {
      return;
    }
    // console.log($event.key);
    // if (KeyCode[$event.key]) {
    switch ($event.key) {
      case 'ArrowDown':
        this._handleArrowDown($event);
        break;
      case 'ArrowUp':
        this._handleArrowUp($event);
        break;
      case 'Space':
        this._handleSpace($event);
        break;
      case 'Enter':
        this._handleEnter($event);
        break;
      case 'Tab':
        this._handleTab($event);
        break;
      case 'Escape':
        this.close();
        $event.preventDefault();
        break;
      case 'Backspace':
        this._handleBackspace();
        break;
    }
    // } else if ($event.key && $event.key.length === 1) {
    // this._keyPress$.next($event.key.toLocaleLowerCase());
    // }
  }

  _handleArrowDown($event: any) {
    // if (this.optionId < this.options.length - 1) {
    //   this.optionId++;
    // }
  }

  _handleArrowUp($event: any) {
    if (this.optionId >= 1) {
      this.optionId--;
    }
  }

  _handleSpace($event: any) {

  }

  _handleEnter($event: any) {
    // this.optionSelect(this.options[this.optionId], $event);
  }

  _handleTab($event: any) {

  }

  _handleBackspace() {

  }
}
