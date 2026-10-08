import { TimestampPipe } from './timestamp.pipe';

describe('TimestampPipe', () => {
  const pipe = new TimestampPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('formats whole and fractional seconds', () => {
    expect(pipe.transform(0)).toBe('0:00.0');
    expect(pipe.transform(5.3)).toBe('0:05.3');
    expect(pipe.transform(125.3)).toBe('2:05.3');
  });

  it('rounds to a tenth without producing 60 seconds', () => {
    expect(pipe.transform(59.96)).toBe('1:00.0');
  });
});
