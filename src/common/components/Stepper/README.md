# [ New ] ui-debio-stepper :tada:
`ui-debio-stepper` It's our new custom component, it's fast with pure CSS and of course easy to use. You just call like another tag
eg `<span>` and `<ui-debio-stepper>` but in pug `span` and `ui-debio-stepper`

### Props
- `items [Array]`: Items stepper
- `with-line-indicator [Boolean]`: To create/show current active step

### How to use

#### - simple
```pug
ui-debio-stepper(
  items="yourSteppersData"
)
```

#### - with indicator
```pug
ui-debio-stepper(
  items="yourSteppersData"
  with-line-indicator
)
```
