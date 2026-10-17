import { describe, expect, it } from 'vitest';
import { landing } from '../src/data/landing';
import { splitEmphasis } from '../src/data/emphasis';

describe('splitEmphasis', () => {
  it('splits the single emphasis pair', () => {
    expect(splitEmphasis('Build from <em>idea</em> to launch.')).toEqual({
      before: 'Build from ',
      emphasis: 'idea',
      after: ' to launch.',
    });
  });

  it('returns the whole string before when there is no emphasis', () => {
    expect(splitEmphasis('No emphasis here.')).toEqual({
      before: 'No emphasis here.',
      emphasis: '',
      after: '',
    });
  });

  it('rejects more than one emphasis pair', () => {
    expect(() => splitEmphasis('<em>One</em> and <em>two</em>')).toThrow(/One/);
  });

  it('rejects an unclosed emphasis tag', () => {
    expect(() => splitEmphasis('An <em>unfinished idea')).toThrow(/unfinished idea/);
  });

  it('splits both landing headlines', () => {
    expect(() => splitEmphasis(landing.en.h1)).not.toThrow();
    expect(() => splitEmphasis(landing.ar.h1)).not.toThrow();
  });
});
