import { Injectable, signal, computed } from '@angular/core';
import { PageConfig } from '../models/interfaces/page-config';
import { GroupConfig } from '../models/interfaces/group-config';

@Injectable({
  providedIn: 'root',
})
export class PageManagementService {
  private readonly _pages = signal<PageConfig[]>([]);
  private readonly _currentPageName = signal<string>('');

  readonly pages = this._pages.asReadonly();
  readonly currentPageName = this._currentPageName.asReadonly();

  readonly currentPage = computed(() => {
    const pageName = this._currentPageName();
    return this._pages().find((p) => p.pageName === pageName) || null;
  });

  constructor() {
    this.initializeDefaultPage();
  }

  private initializeDefaultPage(): void {
    const defaultPage: PageConfig = {
      pageName: 'page',
      groups: {},
    };
    this._pages.set([defaultPage]);
    this._currentPageName.set('page');
  }

  addPage(pageName: string): boolean {
    const trimmedName = pageName.trim();
    if (!trimmedName) {
      console.warn('Page name cannot be empty');
      return false;
    }

    const exists = this._pages().some((p) => p.pageName === trimmedName);
    if (exists) {
      console.warn(`Page "${trimmedName}" already exists`);
      return false;
    }

    const newPage: PageConfig = {
      pageName: trimmedName,
      groups: {},
    };

    this._pages.update((pages) => [...pages, newPage]);
    return true;
  }

  removePage(pageName: string): boolean {
    const pages = this._pages();
    if (pages.length === 1) {
      console.warn('Cannot remove the last page');
      return false;
    }

    const index = pages.findIndex((p) => p.pageName === pageName);
    if (index === -1) {
      console.warn(`Page "${pageName}" not found`);
      return false;
    }

    this._pages.update((pages) => pages.filter((p) => p.pageName !== pageName));

    if (this._currentPageName() === pageName) {
      this._currentPageName.set(this._pages()[0].pageName);
    }

    return true;
  }

  switchPage(pageName: string): boolean {
    const exists = this._pages().some((p) => p.pageName === pageName);
    if (!exists) {
      console.warn(`Page "${pageName}" does not exist`);
      return false;
    }

    this._currentPageName.set(pageName);
    return true;
  }

  getPages(): PageConfig[] {
    return this._pages();
  }

  getCurrentPageName(): string {
    return this._currentPageName();
  }

  getPageByName(pageName: string): PageConfig | null {
    return this._pages().find((p) => p.pageName === pageName) || null;
  }

  setPages(pages: PageConfig[]): void {
    if (!pages || pages.length === 0) {
      console.warn('Cannot set empty pages array');
      return;
    }

    this._pages.set(pages);
    const currentExists = pages.some((p) => p.pageName === this._currentPageName());
    if (!currentExists) {
      this._currentPageName.set(pages[0].pageName);
    }
  }

  clearAllPages(): void {
    this.initializeDefaultPage();
  }

  updatePageGroups(pageName: string, groups: Record<string, GroupConfig>): boolean {
    const pageIndex = this._pages().findIndex((p) => p.pageName === pageName);
    if (pageIndex === -1) {
      console.warn(`Page "${pageName}" not found`);
      return false;
    }

    this._pages.update((pages) =>
      pages.map((page, idx) => (idx === pageIndex ? { ...page, groups } : page))
    );

    return true;
  }
}
