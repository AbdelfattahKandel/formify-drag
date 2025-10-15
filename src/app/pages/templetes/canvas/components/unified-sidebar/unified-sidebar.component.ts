import { Component, ChangeDetectionStrategy, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { PageConfig } from '../../../../../core/models/interfaces/page-config';
import { FieldConfig } from '../../../../../core/models/interfaces/legacy-extras';
import { AddFormDialogComponent } from '../../../../../shared/components/add-form-dialog/add-form-dialog.component';

@Component({
  selector: 'app-unified-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    CdkDrag,
    CdkDropList,
    ScrollingModule,
    AccordionModule,
    ButtonModule,
    TooltipModule,
    BadgeModule,
    AddFormDialogComponent,
  ],
  templateUrl: './unified-sidebar.component.html',
  styleUrl: './unified-sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnifiedSidebarComponent {
  // Inputs
  groupNames = input.required<string[]>();
  selectedGroup = input.required<string>();
  paletteTools = input.required<FieldConfig[]>();

  // Outputs
  groupSelect = output<string>();
  groupAdd = output<string>(); // Changed: now emits the group name directly
  groupRemove = output<string>();

  // Memoized computed values for performance
  groupsCount = computed(() => this.groupNames().length);
  controlsCount = computed(() => this.paletteTools().length);
  
  // Check if there are many items (for virtual scrolling threshold)
  shouldUseVirtualScroll = computed(() => this.paletteTools().length > 20);
  
  // Add form dialog
  showAddFormDialog = signal(false);



  // Groups methods
  onSelectGroup(groupName: string): void {
    this.groupSelect.emit(groupName);
  }

  onAddGroup(): void {
    this.showAddFormDialog.set(true);
  }

  onFormAdded(formName: string): void {
    console.log('Form added:', formName);
    this.groupAdd.emit(formName);
  }

  onRemoveGroup(groupName: string, event: Event): void {
    event.stopPropagation();
    this.groupRemove.emit(groupName);
  }

  isGroupSelected(groupName: string): boolean {
    return this.selectedGroup() === groupName;
  }

  // Palette methods
  trackByFn(index: number, item: any) {
    const base = item?.id ?? item?.type ?? item?.kind ?? 'tool';
    return `${String(base)}-${index}`;
  }

  onDragStarted(tool: any) {
    const randomNum = Math.floor(Math.random() * 10) + 1;
    tool.id = `${tool.type}-${randomNum}`;
  }
}
