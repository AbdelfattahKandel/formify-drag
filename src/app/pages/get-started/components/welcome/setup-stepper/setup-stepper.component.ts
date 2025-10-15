import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { NgClass } from '@angular/common';
import { SetupStylesService, StyleOption, UIOption } from './setup-styles.service';
import { StylePreference, UiLibraryPreference } from '../../../../../core/models/builder-preferences';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setup-stepper',
  standalone: true,
  imports: [ButtonModule, StepperModule, NgClass],
  templateUrl: './setup-stepper.component.html',
  styleUrls: ['./setup-stepper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetupStepperComponent {
  _router = inject(Router)
  @Output() complete = new EventEmitter<{ style: string; ui: string }>();

  protected readonly setupStylesService = inject(SetupStylesService);

  activeIndex = this.setupStylesService.activeIndex;
  styleChoice = this.setupStylesService.styleChoice;
  uiChoice = this.setupStylesService.uiChoice;

  styleOptions: StyleOption[] = this.setupStylesService.styleOptions;
  uiOptions: UIOption[] = this.setupStylesService.uiOptions;

  selectStyle(option: StylePreference): void {
    this.setupStylesService.selectStyle(option);
  }

  selectUI(option: UiLibraryPreference): void {
    this.setupStylesService.selectUI(option);
  }

  next(): void {
    this.setupStylesService.next();
  }

  back(): void {
    this.setupStylesService.back();
  }

  finish(): void {
    const result = this.setupStylesService.finish();

    if (result) {
      this.complete.emit(result);
      this._router.navigateByUrl('/node-layout');
    }
  }

  getColorClasses(color: string, isSelected: boolean): string {
    return this.setupStylesService.getColorClasses(color, isSelected);
  }

  getIconColorClasses(color: string, isSelected: boolean): string {
    return this.setupStylesService.getIconColorClasses(color, isSelected);
  }

  getBadgeColorClass(color: string): string {
    return this.setupStylesService.getBadgeColorClass(color);
  }
}