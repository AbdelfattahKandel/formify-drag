import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { FieldConfig } from '../../../../../core/models/interfaces/legacy-extras';

@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {
  private formFields = new BehaviorSubject<FieldConfig[]>([]);
  private selectedField = new BehaviorSubject<FieldConfig | null>(null);
  private showPreview = new BehaviorSubject<boolean>(false);

  constructor(private fb: FormBuilder) {}

  // Getters
  getFormFields(): Observable<FieldConfig[]> {
    return this.formFields.asObservable();
  }

  getSelectedField(): Observable<FieldConfig | null> {
    return this.selectedField.asObservable();
  }

  getPreviewState(): Observable<boolean> {
    return this.showPreview.asObservable();
  }

  // Setters
  setFormFields(fields: FieldConfig[]): void {
    this.formFields.next([...fields]);
  }

  setSelectedField(field: FieldConfig | null): void {
    this.selectedField.next(field);
  }

  togglePreview(): void {
    this.showPreview.next(!this.showPreview.value);
  }

  // Field Operations
  addField(field: FieldConfig): void {
    const currentFields = this.formFields.value;
    this.formFields.next([...currentFields, field]);
  }

  updateField(updatedField: FieldConfig): void {
    const currentFields = this.formFields.value;
    const index = currentFields.findIndex(f => f.id === updatedField.id);
    
    if (index !== -1) {
      const updatedFields = [...currentFields];
      updatedFields[index] = { ...updatedField };
      this.formFields.next(updatedFields);
    }
  }

  removeField(fieldId: string): void {
    const currentFields = this.formFields.value;
    this.formFields.next(currentFields.filter(f => f.id !== fieldId));
  }

  reorderFields(previousIndex: number, currentIndex: number): void {
    const currentFields = [...this.formFields.value];
    const [movedField] = currentFields.splice(previousIndex, 1);
    currentFields.splice(currentIndex, 0, movedField);
    this.formFields.next(currentFields);
  }

  // Form Operations
  createFormGroup(fields: FieldConfig[]): FormGroup {
    const group: any = {};
    
    fields.forEach(field => {
      group[field.name] = [field.defaultValue || '', field.validators || []];
    });
    
    return this.fb.group(group);
  }

  // Export/Import
  exportForm(): any {
    return {
      fields: this.formFields.value,
      // Add more form metadata as needed
    };
  }

  importForm(data: any): void {
    if (data && Array.isArray(data.fields)) {
      this.formFields.next([...data.fields]);
    }
  }

  // Utility
  generateFieldId(type: string): string {
    return `${type}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
