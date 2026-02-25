// CSS Modules
declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}

// Generic CSS imports
declare module '*.css' {
  const content: string
  export default content
}
