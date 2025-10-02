import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComputedConfig } from '../models/interfaces/enhanced-field-config';

@Injectable({
  providedIn: 'root'
})
export class ComputedFieldService {
  
  /**
   * Calculate computed field value based on formula
   */
  calculateValue(formula: string, formGroup: FormGroup, dependencies: string[]): any {
    try {
      // Get values from dependencies
      const values: Record<string, any> = {};
      dependencies.forEach(dep => {
        const control = formGroup.get(dep);
        values[dep] = control?.value ?? 0;
      });

      // Replace field names with their values in formula
      let expression = formula;
      Object.entries(values).forEach(([key, value]) => {
        const numValue = Number(value) || 0;
        expression = expression.replace(new RegExp(key, 'g'), numValue.toString());
      });

      // Evaluate the expression safely
      return this.evaluateExpression(expression);
    } catch (error) {
      console.error('[ComputedField] Error calculating:', error);
      return null;
    }
  }

  /**
   * Safely evaluate mathematical expressions
   */
  private evaluateExpression(expression: string): number | null {
    try {
      // Remove any non-mathematical characters for safety
      const sanitized = expression.replace(/[^0-9+\-*/().]/g, '');
      
      // Use Function constructor for safer evaluation than eval
      const result = Function(`"use strict"; return (${sanitized})`)();
      
      return isNaN(result) ? null : Number(result);
    } catch (error) {
      console.error('[ComputedField] Expression evaluation error:', error);
      return null;
    }
  }

  /**
   * Format computed value based on format type
   */
  formatValue(value: number | null, format?: string): string {
    if (value === null || value === undefined) return '';

    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      
      case 'percentage':
        return `${value.toFixed(2)}%`;
      
      case 'decimal':
        return value.toFixed(2);
      
      default:
        return value.toString();
    }
  }

  /**
   * Setup watchers for computed field dependencies
   */
  setupComputedField(
    fieldName: string,
    config: ComputedConfig,
    formGroup: FormGroup
  ): void {
    const targetControl = formGroup.get(fieldName);
    if (!targetControl) {
      console.warn(`[ComputedField] Control "${fieldName}" not found`);
      return;
    }

    // Watch dependencies
    config.dependencies.forEach(dep => {
      const depControl = formGroup.get(dep);
      if (depControl) {
        depControl.valueChanges.subscribe(() => {
          const computed = this.calculateValue(config.formula, formGroup, config.dependencies);
          if (computed !== null) {
            const formatted = config.format 
              ? this.formatValue(computed, config.format)
              : computed;
            targetControl.setValue(formatted, { emitEvent: false });
          }
        });
      }
    });

    // Initial calculation
    const initialValue = this.calculateValue(config.formula, formGroup, config.dependencies);
    if (initialValue !== null) {
      const formatted = config.format 
        ? this.formatValue(initialValue, config.format)
        : initialValue;
      targetControl.setValue(formatted, { emitEvent: false });
    }
  }
}
