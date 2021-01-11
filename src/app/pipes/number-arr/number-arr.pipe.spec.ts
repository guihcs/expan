import { NumberArrPipe } from './number-arr.pipe';

describe('NumberArrPipe', () => {
  it('create an instance', () => {
    const pipe = new NumberArrPipe();
    expect(pipe).toBeTruthy();
  });
});
