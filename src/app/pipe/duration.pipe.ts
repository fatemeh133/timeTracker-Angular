import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(value: string): string {
    var nValue = Number(value);

    if (nValue < 0 || !Number.isFinite(nValue)) {
      return 'Invalid duration';
    }

    const hours = Math.floor(nValue / 3600);
    const minutes = Math.floor((nValue % 3600) / 60);
    const seconds = nValue % 60;

    const hoursString = hours.toString().padStart(2, '0');
    const minutesString = minutes.toString().padStart(2, '0');
    const secondsString = seconds.toString().padStart(2, '0');

    return `${hoursString}:${minutesString}:${secondsString}`;
  }
}
