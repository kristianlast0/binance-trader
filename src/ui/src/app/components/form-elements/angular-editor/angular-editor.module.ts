import {NgModule} from '@angular/core';
import {AngularEditorComponent} from './angular-editor.component';
import {AngularEditorToolbarComponent} from './angular-editor-toolbar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { AeSelectComponent } from './ae-select/ae-select.component';
import {AeButtonComponent} from "./ae-button/ae-button.component";
import { AeToolbarSetComponent } from './ae-toolbar-set/ae-toolbar-set.component';
import { AeTableSelectComponent } from './ae-table-select/ae-table-select.component';
import { AeTagSelectComponent } from './ae-tag-select/ae-tag-select.component';

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule
  ],
  declarations: [
    AngularEditorComponent,
    AngularEditorToolbarComponent,
    AeSelectComponent,
    AeTableSelectComponent,
    AeTagSelectComponent,
    AeButtonComponent,
    AeToolbarSetComponent
  ],
  exports: [
    AngularEditorComponent,
    AngularEditorToolbarComponent,
    AeButtonComponent,
    AeToolbarSetComponent
  ]
})

export class AngularEditorModule {}
