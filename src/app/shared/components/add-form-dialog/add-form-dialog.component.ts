import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-add-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './add-form-dialog.component.html',
  styleUrl: './add-form-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddFormDialogComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() add = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  formName: string = '';

  onAdd() {
    if (this.formName.trim()) {
      this.add.emit(this.formName.trim());
      this.formName = '';
      this.visible = false;
      this.visibleChange.emit(false);
    }
  }

  onCancel() {
    this.formName = '';
    this.cancel.emit();
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onHide() {
    this.formName = '';
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
