import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'max',
  standalone: true,
})
export class MaxPipe implements PipeTransform {
  transform(items: any[], property: string): number {
    if (!items || items.length === 0) {
      return 1; // Return 1 to avoid division by zero
    }

    return Math.max(...items.map((item) => item[property] || 0));
  }
}
