export interface HelpItemData<Key extends string = string> {
  key: Key;
  name: string;
  isTutorial?: boolean;
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
