import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadComponent,
      multi: true
    }
  ]
})

export class FileUploadComponent {

  @Input() progress: any;
  @Input() label: string = "";

  onChange?: Function;

  public file: File | null = null;
  public uploading: boolean = false;

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    // Get one file
    const file = event && event.item(0);
    if(this.onChange) this.onChange(file);
    this.file = file;
  }

  constructor(private host: ElementRef<HTMLInputElement>) {}

  writeValue(value: null) {
    // clear file input
    this.host.nativeElement.value = '';
    this.file = null;
  }

  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function) {}

  get stateClass() {
    if (this.uploading) {
      if (this.progress < 25) return 'warning';
      else if (this.progress >= 25 && this.progress < 50) return 'primary';
      else if (this.progress >= 50 && this.progress < 75) return 'info';
      else if (this.progress >= 75) return 'success';
      else return '';
    }
    return '';
  }
}
