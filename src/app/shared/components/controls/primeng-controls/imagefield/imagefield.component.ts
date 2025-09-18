import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormBuilder } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { FieldConfig } from '../../../../../core/models/interfaces/legacy-extras';

@Component({
  selector: 'app-imagefield',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FileUploadModule, ButtonModule, ImageModule],
  templateUrl: './imagefield.component.html',
  styleUrls: ['./imagefield.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagefieldComponent {
  // Inputs (Signals)
  field = input.required<FieldConfig>();
  imagesInput = input<FormArray | null>(null);

  // Dependencies
  private _fb = inject(FormBuilder);

  // Internal state
  // Runtime-only previews (not exported in JSON)
  localUrls: string[] = [];
  private _emptyArray = this._fb.array([]);

  // Helper getter to always return a FormArray
  get images(): FormArray {
    return this.imagesInput() ?? this._emptyArray;
  }

  addImage() {
    this.images.push(this._fb.control(null));
    // keep FormArray values updated (no mutation on config object)
    // keep previews array in sync
    this.localUrls.push('');
  }

  removeImage(index: number) {
    if (this.images.length > 0) {
      this.images.removeAt(index);
    }
    // keep FormArray values updated
    // remove corresponding preview url
    if (index >= 0 && index < this.localUrls.length) {
      const old = this.localUrls[index];
      if (old) URL.revokeObjectURL(old);
      this.localUrls.splice(index, 1);
    }
  }

  onFileSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) return;

    // 1) Store filename only in the FormArray (for JSON export)
    this.images.at(index).setValue(file.name || 'image');

    // 2) Maintain a runtime preview URL separately
    const localUrl = URL.createObjectURL(file);
    this.localUrls[index] = localUrl;
  }
}
