import { action } from '@storybook/addon-actions';

import {MenuItemProps} from '../ui/AppMenu/MenuItem';

export default {
  title: 'Folder Menu',
  component: MenuItem,
};

export const WithText = () => <MenuItem onclick={action('clicked')}>Hello Button</MenuItem>;

WithText.storyName = 'with text';

export const WithSomeEmoji = () => (
  <MenuItem onclick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </MenuItem>
);

WithSomeEmoji.storyName = 'with some emoji';