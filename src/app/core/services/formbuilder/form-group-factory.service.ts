import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormSchema } from '../../models/interfaces/form-schema';
import { FieldConfig } from '../../models/interfaces/legacy-extras';
import { mapValidators } from '../../../utils/map-validators';
import { mapAsyncValidators } from '../../../utils/map-async-validators';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormGroupFactoryService {
  private _fb = inject(FormBuilder);

  build(schema: FormSchema): FormGroup {
    const group = this._fb.group({});
    (schema.fields || []).forEach((field: FieldConfig) => {
      if (!field.formControl || typeof field.formControl !== 'string') return;
      
      const syncValidators = mapValidators(field.validators);
      const asyncValidators = mapAsyncValidators(field.asyncValidators as any);
      
      group.addControl(
        field.formControl,
        this._fb.control(
          field.value || '',
          { validators: syncValidators, asyncValidators }
        )
      );
    });
    return group;
  }
}
