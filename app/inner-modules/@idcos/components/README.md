# components

> This is just an extra part of `@idcos/design-system`.

Extra components out of Design System. Partial components based on `Ant Design`.

We use `@ant-design/icons` for building components with icons.

## How to use

```bash
npm i @idcos/components --save
```

```jsx
import { PageLayout, PageCard } from '@idcos/components';

<PageLayout title='Page Title'>{/** MAIN CONTENT HERE */}</PageLayout>;

<PageCard title='Page Card'>{/** MAIN CONTENT HERE */}</PageCard>;
```

## API

[Find More at Our Design System Storybook](http://10.0.2.118)

## Main changelog

- `2021-07-01 v 1.0.0`

  1. Add new component: `PageLayout`, `PageCard`.

- `2021-07-27 v 1.1.0`

  1. `PageLayout` support `breadcrumb`.
  2. Injecting `@idcos/tokens` to specify color variables.

- `2021-08-04 v 1.1.1`
  1. Add `className` property to components.
  2. Use `classnames` connect component's className.
  3. Fix `PageCard` className.

- `2021-08-27 v 1.1.2`
  1. Add new component: `PageSearch`.
