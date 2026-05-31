/**
 * Type declarations for typographic-* text transform plugins.
 *
 * These packages are used with remark-textr to apply typographic
 * transformations (smart dashes, arrows, symbols, etc.) to text.
 * Each plugin is a simple function that takes a string and returns
 * a transformed string.
 *
 * @see https://github.com/iamstarkov/textr
 */

type TexTransform = (input: string) => string;

declare module 'typographic-arrows' {
  const transform: TexTransform;
  export default transform;
}

declare module 'typographic-copyright' {
  const transform: TexTransform;
  export default transform;
}

declare module 'typographic-em-dashes' {
  const transform: TexTransform;
  export default transform;
}

declare module 'typographic-en-dashes' {
  const transform: TexTransform;
  export default transform;
}

declare module 'typographic-math-symbols' {
  const transform: TexTransform;
  export default transform;
}

declare module 'typographic-registered-trademark' {
  const transform: TexTransform;
  export default transform;
}

declare module 'typographic-single-spaces' {
  const transform: TexTransform;
  export default transform;
}

declare module 'typographic-trademark' {
  const transform: TexTransform;
  export default transform;
}
