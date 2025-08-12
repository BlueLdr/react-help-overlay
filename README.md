# Help Overlay

## Setup

```sh
npm install react-help-overlay
```

### Set up help data

`help-data.tsx`

```tsx
import type { HelpData, HelpItemData } from "react-help-overlay";

const HELP_DATA_ITEMS = {
  "my-button": {
    key: "my-button",
    name: "My Button",
    content: () => <div>
      <p>This is MyButton. It performs some functionality. Here's how it works:</p>
      <p>...</p>
    </div>,
  },
} as const satisfies { [K in string]: HelpItemData<K> };

export type MyHelpDataItems = typeof HELP_DATA_ITEMS

export const HELP_DATA: HelpData = {
  items: HELP_DATA_ITEMS,
};
```

`augmentations.d.ts`

```ts
import type { MyHelpDataItems } from "./path/to/help-data.tsx";

declare module "react-help-overlay" {
  interface HelpDataItems extends McmmHelpDataItems {
  }
}
```

### Rendering layers

```
          Help modal
---------------------------- help modal backdrop ----
   Highlighted help elements (when overlay is active)
          Help button
---------------------------- help overlay backdrop (when overlay is active) ----

the rest of the app
```
