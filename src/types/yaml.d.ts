/**
 * Type declarations for YAML file imports
 */

declare module '*.yml' {
  const content: unknown;
  export default content;
}

declare module '*.yaml' {
  const content: unknown;
  export default content;
}
