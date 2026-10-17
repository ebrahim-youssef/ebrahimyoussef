interface EmphasisParts {
  before: string;
  emphasis: string;
  after: string;
}

export function splitEmphasis(text: string): EmphasisParts {
  const openingTags = text.match(/<em>/g) ?? [];
  const closingTags = text.match(/<\/em>/g) ?? [];

  if (openingTags.length === 0 && closingTags.length === 0) {
    return { before: text, emphasis: '', after: '' };
  }

  if (openingTags.length !== 1 || closingTags.length !== 1) {
    throw new Error(`Invalid emphasis markup in text: ${text}`);
  }

  const openingIndex = text.indexOf('<em>');
  const closingIndex = text.indexOf('</em>');
  if (closingIndex < openingIndex) {
    throw new Error(`Invalid emphasis markup in text: ${text}`);
  }

  return {
    before: text.slice(0, openingIndex),
    emphasis: text.slice(openingIndex + 4, closingIndex),
    after: text.slice(closingIndex + 5),
  };
}
