# React Helmet Integration Example

This example demonstrates how to use React Helmet in the application.

## Example 1: Using DynamicHelmet Component (Recommended)

```typescript
'use client';

import DynamicHelmet from '@/app/components/DynamicHelmet';
import { useState } from 'react';

export default function ExamplePage() {
  const [pageTitle, setPageTitle] = useState('Initial Title');

  return (
    <>
      <DynamicHelmet
        title={pageTitle}
        description="This is a dynamic example page"
        keywords={['react', 'helmet', 'nextjs', 'example']}
      />
      
      <div>
        <h1>Dynamic Metadata Example</h1>
        <p>Current title: {pageTitle}</p>
        
        <button onClick={() => setPageTitle('Updated Title')}>
          Update Page Title
        </button>
      </div>
    </>
  );
}
```

## Example 2: Using Helmet Directly (Advanced)

```typescript
'use client';

import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';

export default function AdvancedExample() {
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    // Simulate tracking view count
    const count = parseInt(localStorage.getItem('viewCount') || '0', 10);
    setViewCount(count + 1);
    localStorage.setItem('viewCount', (count + 1).toString());
  }, []);

  return (
    <>
      <Helmet>
        <title>Page Views: {viewCount}</title>
        <meta name="description" content={`This page has been viewed ${viewCount} times`} />
        <meta property="og:title" content={`Page Views: ${viewCount}`} />
        <link rel="canonical" href="https://example.com/advanced-example" />
      </Helmet>
      
      <div>
        <h1>Advanced Helmet Example</h1>
        <p>This page has been viewed {viewCount} times</p>
      </div>
    </>
  );
}
```

## Example 3: Conditional Metadata

```typescript
'use client';

import DynamicHelmet from '@/app/components/DynamicHelmet';
import { useState } from 'react';

type Theme = 'light' | 'dark';

export default function ThemeExample() {
  const [theme, setTheme] = useState<Theme>('light');

  const themeTitle = theme === 'light' ? 'Light Mode' : 'Dark Mode';
  const themeDescription = `Viewing in ${theme} mode`;

  return (
    <>
      <DynamicHelmet
        title={themeTitle}
        description={themeDescription}
      />
      
      <div className={`theme-${theme}`}>
        <h1>Theme-Based Metadata Example</h1>
        <p>Current theme: {theme}</p>
        
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Toggle Theme
        </button>
      </div>
    </>
  );
}
```

## When NOT to Use React Helmet

❌ **Don't use for static metadata:**

```typescript
// ❌ BAD: Using Helmet for static content
'use client';
import { Helmet } from 'react-helmet-async';

export default function BlogPost() {
  return (
    <>
      <Helmet>
        <title>My Static Blog Post</title>
        <meta name="description" content="A static description" />
      </Helmet>
      <article>Post content...</article>
    </>
  );
}
```

✅ **Instead, use Next.js Metadata API:**

```typescript
// ✅ GOOD: Using Next.js Metadata API
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Static Blog Post',
  description: 'A static description',
};

export default function BlogPost() {
  return <article>Post content...</article>;
}
```

## Key Takeaways

1. **Use Next.js Metadata API for static metadata** (99% of cases)
2. **Use React Helmet only for dynamic, client-side metadata updates**
3. **Always wrap Helmet usage in client components** ('use client' directive)
4. **Remember: Helmet requires JavaScript on the client side** (worse for SEO than server-rendered metadata)

## Testing

To test your Helmet implementation:

```bash
npm run test:jest
```

Make sure your component is wrapped in `<HelmetProvider>` for tests:

```typescript
import { render } from '@testing-library/react';
import HelmetProvider from '@/app/components/HelmetProvider';
import MyComponent from './MyComponent';

it('renders with dynamic metadata', () => {
  render(
    <HelmetProvider>
      <MyComponent />
    </HelmetProvider>
  );
});
```
