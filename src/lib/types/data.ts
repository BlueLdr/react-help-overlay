export interface HelpItemData<Key extends string = string> {
  /** Unique key for this help item */
  key: Key;
  /** Title to display in the help popup */
  name: string;
  /** If true, the help item will pop up the first time the user interacts with this element */
  isTutorial?: boolean;
  /** Content to render inside the help popup */
  content: string | ((props: HelpContentRenderProps) => React.ReactNode);
}

export interface HelpContentRenderProps {
  goToHelpPage: (key: HelpItemKey | null) => void;
}

// HelpDataItems needs at least one key for the code inside the library to
// recognize that it's indexable.
// Choosing a character that's unlikely to be used in a key so it doesn't
// pollute autocomplete suggestions.
type PlaceholderKey = "~";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface HelpDataItems
  extends Partial<Record<PlaceholderKey, HelpItemData<PlaceholderKey>>> {}

export type HelpItemKey = keyof HelpDataItems;

export interface HelpData {
  items: HelpDataItems &
    Omit<
      {
        [K in HelpItemKey]: HelpItemData<K>;
      },
      PlaceholderKey
    >;
  introSequence?: HelpItemKey[];
}
