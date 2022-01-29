import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {

  transform(numSeconds: number, ...args: unknown[]): string {
    const minutes = Math.floor(numSeconds / 60);
    const formattedSeconds = (numSeconds % 60).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).padStart(5, '0');
    return `${minutes}:${formattedSeconds}`
  }
}
