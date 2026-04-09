/**
 * Type declarations for remark-mentions.
 *
 * The package ships its own types, but declares `this: Processor`
 * which causes errors when the plugin is called directly (outside
 * of unified's `.use()` pipeline). This override provides a
 * standalone call signature matching the actual runtime behavior.
 *
 * @see https://github.com/FinnRG/remark-mentions
 */

declare module 'remark-mentions' {
  import type { Root } from 'mdast';

  interface Options {
    usernameLink: (username: string) => string;
  }

  export default function remarkMentions(options?: Options): (tree: Root) => void;
  export type { Options };
}
