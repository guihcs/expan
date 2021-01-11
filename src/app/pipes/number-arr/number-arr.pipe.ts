import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberArr'
})
export class NumberArrPipe implements PipeTransform {

  transform(value: any[], ...args: unknown[]): unknown {
    let res = [];
    for (let i = 0; i < value.length; i++) {
      res[i] = value[i].toFixed(2)
    }
    return res;
  }

}
