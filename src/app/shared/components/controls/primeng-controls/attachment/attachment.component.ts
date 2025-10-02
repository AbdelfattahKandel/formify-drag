import { ChangeDetectionStrategy, Component, input, ViewChild, ElementRef, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { FieldConfig } from '../../../../../core/models/interfaces/legacy-extras';
import { Image } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { ImageUploadService } from '../../../../../core/services/upload/image-upload.service';

@Component({
  selector: 'app-attachment',
  standalone: true,
  imports: [ReactiveFormsModule, Image, ButtonModule],
  templateUrl: './attachment.component.html',
  styleUrl: './attachment.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class AttachmentComponent {
  field = input.required<FieldConfig>();
  imageUrl: string | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private _uploader = inject(ImageUploadService);

  isFormControl(value: unknown): value is FormControl {
    return value instanceof FormControl;
  }

  formControlInst(): FormControl | null {
    const fc = this.field().formControl as any;
    return this.isFormControl(fc) ? fc : null;
  }

  controlName(): string | null {
    const fc = this.field().formControl as any;
    return typeof fc === 'string' ? fc : null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Preview only for images
    if (file.type && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.imageUrl = null;
    }

    const ctrl = this.formControlInst();
    const props = (this.field() as any).componentProps || {};
    const uploadUrl: string | undefined = props['uploadUrl'];
    const folder: string = props['uploadFolder'] || 'uploads';

    if (uploadUrl && uploadUrl.trim()) {
      this._uploader.uploadImage(file, uploadUrl, 'File', { Folder: folder }).subscribe({
        next: (res: any) => {
          const uploadedUrl = (res as any)?.url || '';
          const v = uploadedUrl || file.name;
          if (ctrl) ctrl.setValue(v);
          (this.field() as any).value = v;
        },
        error: () => {
          if (ctrl) ctrl.setValue(file.name);
          (this.field() as any).value = file.name;
        },
      });
    } else {
      if (ctrl) ctrl.setValue(file.name);
      (this.field() as any).value = file.name;
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
}
