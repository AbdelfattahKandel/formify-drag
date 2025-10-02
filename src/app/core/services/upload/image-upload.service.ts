import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type UploadExtra = Record<string, string | Blob> | FormData | undefined;

@Injectable({ providedIn: 'root' })
export class ImageUploadService {
  private _http = inject(HttpClient);

  /**
   * Uploads a file to the given URL as multipart/form-data.
   * Appends the file under `fieldName` (default: 'File').
   * Any extra fields can be passed via the `extra` object or a prebuilt FormData.
   */
  uploadImage(file: File, url: string, fieldName: string = 'File', extra?: UploadExtra): Observable<any> {
    const fd = extra instanceof FormData ? extra : new FormData();

    if (!(extra instanceof FormData) && extra && typeof extra === 'object') {
      Object.entries(extra).forEach(([k, v]) => fd.append(k, v));
    }

    fd.append(fieldName || 'File', file);
    return this._http.post<any>(url, fd);
  }
}
