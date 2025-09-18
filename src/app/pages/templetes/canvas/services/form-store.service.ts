import { Injectable, signal, computed } from '@angular/core';
import { FieldConfig } from '../../../../../core/models/interfaces/legacy-extras';
import { FormState, initialFormState } from '../models/form-state.interface';

@Injectable({
  providedIn: 'root'
})
export class FormStoreService {
  private state = signal<FormState>(initialFormState);

  // Selectors
  fields = computed(() => this.state().fields);
  selectedField = computed(() => this.state().selectedField);
  isPreviewMode = computed(() => this.state().isPreviewMode);
  formTitle = computed(() => this.state().formTitle);

  // Actions
  setFields(fields: FieldConfig[]): void {
    this.state.update(state => ({
      ...state,
      fields: [...fields]
    }));
  }

  addField(field: FieldConfig): void {
    this.state.update(state => ({
      ...state,
      fields: [...state.fields, field]
    }));
  }

  updateField(updatedField: FieldConfig): void {
    this.state.update(state => {
      const index = state.fields.findIndex(f => f.id === updatedField.id);
      if (index === -1) return state;

      const fields = [...state.fields];
      fields[index] = { ...updatedField };

      return {
        ...state,
        fields,
        selectedField: state.selectedField?.id === updatedField.id ? updatedField : state.selectedField
      };
    });
  }

  removeField(fieldId: string): void {
    this.state.update(state => ({
      ...state,
      fields: state.fields.filter(field => field.id !== fieldId),
      selectedField: state.selectedField?.id === fieldId ? null : state.selectedField
    }));
  }

  reorderFields(previousIndex: number, currentIndex: number): void {
    this.state.update(state => {
      const fields = [...state.fields];
      const [movedField] = fields.splice(previousIndex, 1);
      fields.splice(currentIndex, 0, movedField);
      return { ...state, fields };
    });
  }

  setSelectedField(field: FieldConfig | null): void {
    this.state.update(state => ({
      ...state,
      selectedField: field ? { ...field } : null
    }));
  }

  togglePreviewMode(): void {
    this.state.update(state => ({
      ...state,
      isPreviewMode: !state.isPreviewMode
    }));
  }

  setFormTitle(title: string): void {
    this.state.update(state => ({
      ...state,
      formTitle: title
    }));
  }

  resetForm(): void {
    this.state.set(initialFormState);
  }
}
