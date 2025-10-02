import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { PageConfig } from '../../../../../core/models/interfaces/page-config';

@Component({
  selector: 'app-page-tabs',
  standalone: true,
  imports: [CommonModule, TabViewModule, ButtonModule, TooltipModule],
  templateUrl: './page-tabs.component.html',
  styleUrls: ['./page-tabs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTabsComponent {
  pages = input.required<PageConfig[]>();
  currentPageName = input.required<string>();

  pageSwitch = output<string>();
  pageAdd = output<void>();
  pageRemove = output<string>();

  onTabChange(event: { index: number }): void {
    const pages = this.pages();
    if (event.index >= 0 && event.index < pages.length) {
      this.pageSwitch.emit(pages[event.index].pageName);
    }
  }

  onAddPage(): void {
    this.pageAdd.emit();
  }

  onRemovePage(pageName: string, event: Event): void {
    event.stopPropagation();
    this.pageRemove.emit(pageName);
  }

  getCurrentIndex(): number {
    const pages = this.pages();
    const currentName = this.currentPageName();
    return pages.findIndex((p) => p.pageName === currentName);
  }
}
