import { Observable } from 'rxjs';

export interface MyFile {
  fileName: string;
  size: number;
  date: number;
  path: string;
  url?: Observable<string>;
  id?: string;
}
