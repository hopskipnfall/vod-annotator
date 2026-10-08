import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestamp',
})
export class TimestampPipe implements PipeTransform {
  transform(numSeconds: number, ...args: unknown[]): string {
    // Round first so e.g. 59.96 becomes 1:00.0 rather than 0:60.0.
    const total = Math.round(numSeconds * 10) / 10;
    const minutes = Math.floor(total / 60);
    const formattedSeconds = (total - minutes * 60)
      .toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })
      .padStart(4, '0');
    return `${minutes}:${formattedSeconds}`;
  }
}
