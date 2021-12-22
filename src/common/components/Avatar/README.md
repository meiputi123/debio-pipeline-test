# [ New ] ui-debio-avatar:tada:
`ui-debio-avatar` It's our new custom component, it's fast with pure CSS and of course easy to use. You just call like another tag
eg `<span>` and `<ui-debio-avatar>` but in pug `span` and `ui-debio-avatar`

### Props
- `src[String]`: To set image src url/source
- `size[String, Number]`: To set avatar size
- `initial[String]`: To create initial when url null
- `background[String]`: To set background avatar
- `border-size[String, Number]`: To set avatar border
- `border-color[String]`: To set border color avatar
- `option-text[String]`: To create an optional text
- `elevation[String, Number]`: To set avatar shadow
- `to[String, Object]`: To directed/navigate user to another route
- `rounded-type[String, Number]`: 
- `option[Boolean]`: To enable option text
- `rounded[Boolean]`: To enable rounded

### Slots
`icon`: If you want to create avatar to an icon you will be need this prop

### How to use


#### - simple
```pug
ui-debio-avatar(src="urlImage" size="20")
```

#### - with slot icon
```pug
ui-debio-avatar(
  size="24"
)
  ui-debio-icon(
    slot="icon"
    :icon="customIcon"
    size="16"
  )
```

#### - with option
```pug
ui-debio-avatar(
  size="24"
  src="urlImage"
  option
  option-text="Connect"
  @optionClicked="connectToMetamask"
)
```