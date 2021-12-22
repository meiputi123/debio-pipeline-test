# [ New ] ui-debio-input :tada:
`ui-debio-input` It's our new custom component, it's fast with pure CSS and of course easy to use. You just call like another tag
eg `<span>` and `<ui-debio-input>` but in pug `span` and `ui-debio-input`

### Props
- `width [String, Number]`: To adjust the width
- `label [String]`: To add and set a label
- `block [Boolean]`: To set width to 100%
- `disabled [Boolean]`: To set input to a disabled state

### Slots
- `icon-prepend`: To add an icon on the left side of the input
- `icon-append`: To add an icon  on the right side of the input

### How to use

#### - simple
```pug
ui-debio-input(
  v-model="yourData"
)
```

#### - with label
```pug
ui-debio-input(
  v-model="yourData"
  label="Im your label"
)
```
_How to use `ui-debio-icon` please check debio icon documentation here `src\core\components\ui\Icon\README.md`_
#### - with prepend icon
```pug
ui-debio-input(
  v-model="yourData"
  label="Im your label"
)
  ui-debio-icon(:icon="nameIcon" size="20" slot="icon-prepend" stroke)
```

#### - with append icon
```pug
ui-debio-input(
  v-model="yourData"
  label="Im your label"
)
  ui-debio-icon(:icon="nameIcon" size="20" slot="icon-append" stroke)
```
