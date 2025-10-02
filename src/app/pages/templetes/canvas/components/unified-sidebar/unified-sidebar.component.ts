import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { PageConfig } from '../../../../../core/models/interfaces/page-config';
import { FieldConfig } from '../../../../../core/models/interfaces/legacy-extras';

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
  ],
  templateUrl: './unified-sidebar.component.html',
  styleUrl: './unified-sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnifiedSidebarComponent {
  // Inputs
  pages = input.required<PageConfig[]>();
  currentPageName = input.required<string>();
  groupNames = input.required<string[]>();
  selectedGroup = input.required<string>();
  paletteTools = input.required<FieldConfig[]>();

  // Outputs
  pageSwitch = output<string>();
  pageAdd = output<void>();
  pageRemove = output<string>();
  groupSelect = output<string>();
  groupAdd = output<void>();
  groupRemove = output<string>();

  // Memoized computed values for performance
  pagesCount = computed(() => this.pages().length);
  groupsCount = computed(() => this.groupNames().length);
  controlsCount = computed(() => this.paletteTools().length);
  
  // Check if there are many items (for virtual scrolling threshold)
  shouldUseVirtualScroll = computed(() => this.paletteTools().length > 20);

  // Pages methods
  onSelectPage(pageName: string): void {
    this.pageSwitch.emit(pageName);
  }

  onAddPage(): void {
    this.pageAdd.emit();
  }

  onRemovePage(pageName: string, event: Event): void {
    event.stopPropagation();
    this.pageRemove.emit(pageName);
  }

  isPageSelected(pageName: string): boolean {
    return this.currentPageName() === pageName;
  }

  // Groups methods
  onSelectGroup(groupName: string): void {
    this.groupSelect.emit(groupName);
  }

  onAddGroup(): void {
    this.groupAdd.emit();
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
