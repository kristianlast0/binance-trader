import { Component, Input, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
// import * as customBuild from '../../../../../../../assets/ckeditor/default/ckeditor-build/build/ckeditor';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.scss']
})

export class CkeditorComponent {

  @ViewChild('editor') editorComponent?: CKEditorComponent;

  @Input() content: string = "";

  public Editor = ClassicEditor; // customBuild;

  @Input() name: string = "";
  @Input() control: UntypedFormControl = new UntypedFormControl("");
  @Input() placeholder = '';
  @Input() errors: any = null;

  public onReady(editor: any) {
    console.log('onREADY');
    editor.config.extraAllowedContent = '*{*}';
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  public getEditor() {
    // Warning: This may return "undefined" if the editor is hidden behind the `*ngIf` directive or
    // if the editor is not fully initialised yet.
    // this.editorComponent.config.extraAllowedContent = '*{*}';
    return this.editorComponent ? this.editorComponent.editorInstance : undefined;
  }

  clear() {
    this.control.patchValue('');
  }

}
