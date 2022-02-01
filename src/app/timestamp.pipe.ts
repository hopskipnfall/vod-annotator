import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestamp',
})
export class TimestampPipe implements PipeTransform {
  transform(numSeconds: number, ...args: unknown[]): string {
    const minutes = Math.floor(numSeconds / 60);
    const formattedSeconds = (numSeconds % 60)
      .toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })
      .padStart(4, '0');
    return `${minutes}:${formattedSeconds}`;
  }
}
