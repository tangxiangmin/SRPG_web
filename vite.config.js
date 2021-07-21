export default {
    esbuild: {
      jsxFactory: 'createElement',
      jsxFragment: 'Fragment',
      jsxInject: `import {createElement} from 'react'`,
      target: 'es2020',
      format: 'esm'
    }
  }
