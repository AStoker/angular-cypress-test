import { Interval } from '../../../src/app/interval';

describe('testing private fields', () => {

  it('should support private fields in class', () => {
    let interval = new Interval(1, 2);
    expect(interval.hours).to.equal(1);
  });
});
