# [ New ] ui-debio-icon:tada:
`ui-debio-icon` It's our new custom component, it's fast with pure CSS and of course easy to use. You just call like another tag
eg `<span>` and `<ui-debio-icon>` but in pug `span` and `ui-debio-icon`

### Props
- `icon [String]`: To set icon svg
- `size [String, Number]`: To set icon size
- `view-box [String]`: To set svg viewbox
- `stroke-width [String, Number]`:  To set stroke width icon
- `color [String]`: To set color of icon
- `fill [Boolean]`: To set icon to fill svg mode
- `stroke [Boolean]`:  To set icon to stroke svg mode

### How to use

NOTE: To fill the icon prop `icon` you need to import an icon from `@/common/icons`

```js
import {  metamaskFoxIcon } from "@/common/icons"

// Then you add/register the metamaskFoxIcon to data properties like so
export default {
  name: "YourComponent",
  data: () => ({ metamaskFoxIcon  })
}
```


#### - fill
```pug
ui-debio-icon(:icon="nameIcon" size="20" fill)
```

#### - stroke
```pug
ui-debio-icon(:icon="nameIcon" size="20" stroke)
```
