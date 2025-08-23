// TODO: Convert this doc from scribbled notes to an actual README. 🙃

# Help Overlay

### The Idea

You have a global help button that's always visible. You click on the button to enable the help overlay. In this state, any items on the page that have help information will be rendered on top of the overlay, and everything else in the app will be dimmed. When you click on an item,
the help popup will appear with the help information for that item.  
Additionally, you can designate help items as tutorials. The first time the user interacts with a particular element or feature, the help popup will automatically appear as a one-time tutorial.

### The Implementation

The entire system is built around hooks. There are only two components from the library that you need to render in your component tree, and both should be around the root of the DOM.

```tsx
<HelpProvider data={HELP_DATA} initialState={userState} onUpdateState={storeUserState}>
  <AllTheOtherRootLevelProvidersForMyApp>
  <HelpOverlay renderOverlay={(isActive, props) => <MyBackdropOrOverlay open={isActive} {...props}/>}>
    ... the rest of my app ...
  </HelpOverlay>
</HelpProvider>
```

Technically only `<HelpProvider>` is required. The `<HelpOverlay>` can be implemented manually using the hooks available in the library, if you need further customization.

As this library is headless, you will need to implement the components for rendering the help button and popup. This is made very simple by using the `useHelpButton` and `useHelpPopup` hooks.

`HelpButton.tsx`

```tsx
import { useHelpButton } from "react-help-overlay";
import { Button } from "your-ui-library";
import { CloseIcon, HelpIcon } from "your-icon-library";

export const HelpButton = () => {
  const [props, isActive] = useHelpButton();
  
  return (
    <Button {...props}>
      {isActive ? <CloseIcon/> : <HelpIcon/>}
    </Button>
  )
}
```

`HelpPopup.tsx`
```tsx
import { useHelpPopup, useHelpActiveContent } from "react-help-overlay";
import { Popup } from "your-ui-library";

export const HelpPopup = () => {
  const [isOpen, attrs, callbacks] = useHelpPopup();
  const activeContent = useHelpActiveContent(callbacks);
  
  return (
    <Popup 
      id="help-popup"
      // make sure these attrs are passed to the root element of the popup window
      // and not the backdrop, to ensure correct the z-indexes are set
      dialogElementProps={attrs}
      open={isOpen}
      closePopup={callbacks.closePopup}
      titleText={activeContent.name}
    >
      {activeContent.content}
    </Popup>
  )
}
```

Now you can hook up items throughout the application to the help system using `useHelpItemAttributes`.

`InterestingButton.tsx`
```tsx
import { useHelpItemAttributes } from "react-help-overlay";

export const InterestingButton = (props) => {
  const attrs = useHelpItemAttributes("interesting-button");
  
  return (
    <Button {...props} {...attrs}>
      Something Interesting
    </Button>
  );
}
```

When you click the `<HelpButton>` and activate the overlay, everything on the page except for `<InterestingButton>` (and any other help items) will be dimmed. Clicking on `<InterestingButton>` will open the help popup with the help info for `"interesting-button"`. 


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
          Help popup
---------------------------- help popup backdrop ----
   Highlighted help elements (when overlay is active)
          Help button
---------------------------- help overlay backdrop (when overlay is active) ----

the rest of the app
```
