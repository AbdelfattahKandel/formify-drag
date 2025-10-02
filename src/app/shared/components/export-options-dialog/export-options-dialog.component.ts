import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';

export interface ExportOptions {
  styleFormat: 'tailwind' | 'css';
  prettyPrint: boolean;
  includeValues: boolean;
  includeEmptyFields: boolean;
}

@Component({
  selector: 'app-export-options-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    RadioButtonModule,
    CheckboxModule
  ],
  templateUrl: './export-options-dialog.component.html',
  styleUrl: './export-options-dialog.component.css'
})
export class ExportOptionsDialogComponent {
  @Input() visible: boolean = false;
  @Input() mode: 'generate' | 'export' = 'export'; // New: to control button text
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() export = new EventEmitter<ExportOptions>();
  @Output() cancel = new EventEmitter<void>();

  // Export options
  styleFormat: 'tailwind' | 'css' = 'tailwind';
  prettyPrint: boolean = true;
  includeValues: boolean = false;
  includeEmptyFields: boolean = false;
  
  get buttonLabel(): string {
    return this.mode === 'generate' ? 'Generate JSON' : 'Export JSON';
  }
  
  get buttonIcon(): string {
    return this.mode === 'generate' ? 'pi pi-code' : 'pi pi-download';
  }


  onExport() {
    const options: ExportOptions = {
      styleFormat: this.styleFormat,
      prettyPrint: this.prettyPrint,
      includeValues: this.includeValues,
      includeEmptyFields: this.includeEmptyFields
    };
    
    console.log('📦 [Export Options] Selected:', options);
    this.export.emit(options);
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onCancel() {
    this.cancel.emit();
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onHide() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
