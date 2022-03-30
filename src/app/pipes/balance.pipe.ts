import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'balance'
})
export class BalancePipe implements PipeTransform {

  transform(value: number | undefined): string {
    if (!value) return '';

    return value.toLocaleString().split(',')[0] + value.toString().slice(value.toString().indexOf('.'), value.toString().indexOf('.') + 3);
  }
}
