import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mean'
})
export class MeanPipe implements PipeTransform {

  transform(value: any[], ...args: any[]): any {

    let reduce = value.reduce((previousValue, currentValue) => previousValue + currentValue);

    return reduce / value.length;
  }

}
