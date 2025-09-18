import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-form-toolbar',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToolbarModule],
  template: `
    <p-toolbar>
      <div class="flex justify-between w-full">
        <div class="flex gap-2">
          <button 
            pButton 
            icon="pi pi-save" 
            label="حفظ النموذج"
            class="p-button-success"
            (click)="saveForm()"
          ></button>
          <button 
            pButton 
            icon="pi pi-eye" 
            label="معاينة"
            class="p-button-info"
            (click)="togglePreview()"
          ></button>
        </div>
        
        <div class="flex gap-2">
          <button 
            pButton 
            icon="pi pi-trash" 
            label="مسح الكل"
            class="p-button-danger"
            (click)="clearForm()"
          ></button>
          <button 
            pButton 
            icon="pi pi-code" 
            label="تصدير JSON"
            class="p-button-help"
            (click)="exportJson()"
          ></button>
        </div>
      </div>
    </p-toolbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormToolbarComponent {
  @Output() save = new EventEmitter<void>();
  @Output() preview = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();
  @Output() export = new EventEmitter<void>();

  saveForm() {
    this.save.emit();
  }

  togglePreview() {
    this.preview.emit();
  }

  clearForm() {
    this.clear.emit();
  }

  exportJson() {
    this.export.emit();
  }
}
