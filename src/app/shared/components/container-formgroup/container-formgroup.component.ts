import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, ControlContainer, FormGroupDirective, FormGroupName } from '@angular/forms';
import { FieldConfig } from '../../../core/models/interfaces/legacy-extras';
import { CdkDropList, CdkDragDrop } from '@angular/cdk/drag-drop';
import { CreateformbuilderService } from '../../../core/services/formbuilder/createformbuilder.service';
// Child control components (static imports to avoid circular deps)
// No direct control components are used here; children are rendered via RerenderComponent
import { RerenderComponent } from '../../../pages/templetes/rerender/rerender.component';

@Component({
  selector: 'app-container-formgroup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CdkDropList, RerenderComponent],
  templateUrl: './container-formgroup.component.html',
  styleUrls: ['./container-formgroup.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupName },
    { provide: FormGroupDirective, useExisting: FormGroupName }
  ]
})
export class ContainerFormgroupComponent {
  group = input.required<FieldConfig>();
  private readonly formBuilderService = inject(CreateformbuilderService);

  groupKey(): string {
    const g = this.group() as any;
    return (g.key || g.id || '') + '';
  }

  groupLabel(): string | null {
    const g = this.group() as any;
    return (g.label as string) || null;
  }

  children(): FieldConfig[] {
    const g = this.group() as any;
    const list = Array.isArray(g.children)
      ? g.children
      : g.children && typeof g.children === 'object'
        ? Object.values(g.children)
        : [];
    return (list as FieldConfig[]) || [];
  }

  onDrop(event: CdkDragDrop<any>) {
    const tool = event.item?.data as FieldConfig;
    if (!tool) return;
    const copied = this.formBuilderService.createCopiedField(tool as any);
    this.formBuilderService.addChildToGroup(this.group(), copied);
  }
}
