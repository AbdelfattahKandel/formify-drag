import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormBuilder } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { FieldConfig } from '../../../../../core/models/interfaces/legacy-extras';
import { HttpClient } from '@angular/common/http';
import { ImageUploadService } from '../../../../../core/services/upload/image-upload.service';

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
  // Optional config inputs
  uploadUrl = input<string>('');
  fileFieldName = input<string>('File');
  uploadFolder = input<string>('');

  // Dependencies
  private _fb = inject(FormBuilder);
  private _uploader = inject(ImageUploadService);

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

    // 1) Maintain a runtime preview URL immediately for UX
    const localUrl = URL.createObjectURL(file);
    this.localUrls[index] = localUrl;

    const url = this.uploadUrl();
    const fieldName = this.fileFieldName();
    const folder = this.uploadFolder();
    if (url && url.trim()) {
      // 2) Upload to API, then persist returned URL in FormArray
      this._uploader.uploadImage(file, url, fieldName, folder ? { Folder: folder } : undefined).subscribe({
        next: (res: any) => {
          const uploadedUrl = (res && (res as any).url) ? (res as any).url : '';
          this.images.at(index).setValue(uploadedUrl || file.name || 'image');
        },
        error: () => {
          // Fallback to filename if upload fails
          this.images.at(index).setValue(file.name || 'image');
        },
      });
    } else {
      // No API configured: fallback to filename
      this.images.at(index).setValue(file.name || 'image');
    }
  }
}
