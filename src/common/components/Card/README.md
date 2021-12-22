# [ New ] ui-debio-card :tada:
`ui-debio-card` It's our new custom component, it's fast with pure CSS and of course easy to use. You just call like another tag
eg `<span>` and `<ui-debio-card>` but in pug `span` and `ui-debio-card`

### Props
- `width [String, Number]`: To adjust the width
- `title [String]`: To set a title
- `sub-title [String]`: To set a subtitle
- `to [String]`: If you set `card-link` you need to set this as well, where the user will be directed after clicking
- `centered-content [Boolean]`:  To create all content centered
- `block [Boolean]`: To set width to 100%
- `card-link [Boolean]`: To create card clickable and navigate like anchor tag
- `with-dismiss [Boolean]`: It will create a times/close icon on the top right of this card
- `tiny-card [Boolean]`: Will create a card with small size (_It will be used infrequently, but maybe I see the possibility that it will be used in many places_)
- `with-icon [Boolean]`: Will create an icon

### How to use

#### - Tiny card
there's some slot can be filled. Like
`icon`, `title` and `subtitle`
```pug
ui-debio-card(
  title="Request a Test"
  sub-title="Get your biological sample tested"
  tiny-card
)
```
![image](https://user-images.githubusercontent.com/67890542/131823471-5e75e5fc-31a5-4ce6-8182-b9067941870d.png)
#### - Tiny card with icon
```pug
ui-debio-card(
  title="Request a Test"
  sub-title="Get your biological sample tested"
  with-icon
  tiny-card
)
```
![image](https://user-images.githubusercontent.com/67890542/131823653-d62f92f2-20f9-49be-8598-882c29521b39.png)
Note: If you did not set your custom icon, the icon will be set to default like this
![image](https://user-images.githubusercontent.com/67890542/131824203-f7d77625-c0cc-49f9-9e56-5f37edf4fb46.png)

#### How to set the icon?
```pug
ui-debio-card(
  title="Request a Test"
  sub-title="Get your biological sample tested"
  with-icon
  tiny-card
)
  v-icon (slot="icon") mdi-flash
```
Or
```pug
ui-debio-card(
  title="Request a Test"
  sub-title="Get your biological sample tested"
  with-icon
  tiny-card
)
  ui-debio-icon(slot="icon" icon="someIcon")
```
_How to use `ui-debio-icon` please check debio icon documentation `src\core\components\ui\Icon\README.md`_

#### - Tiny card with custom title and subtitle
```pug
ui-debio-card(tiny-card)
  span(slot="title") Custom title
  span(slot="subtitle") Custom subtitle
```


#### - Default card
This will be very useful for wrapper components, alert dialogs, there's some slot can be filled. Like
`header` and `footer`. The default slot will be set as a body slot
```pug
ui-debio-card
  template(slot="header")
     //- You can set your custom header here ->
  template
     //- You can set your custom body here ->
  template(slot="footer") span Footer
    //- You can set your custom footer here ->
```
