# AppBar
Resolve the icons from src/state.ts and properly displaying it in src/ui/AppBar/AppList

# Refactoring
Refactor all components that will be reused in more than one location to use AccessorComponent for better reactivity and reusability. Please do something similar to src/ui/AppBar/AppCircle

There are several TypeScript errors across the project. Please fix them

# AppMenu
AppMenu should just be a wrapper because each app will have a very different menu in terms of items

# All AppMenu Content Components
Make all AppMenu Content Components as component like as possible with AccessorComponent

# Icons
Properly move all Icons into src/ui/icons

# AddressBook App
Start creating the address book app components
- Contact Table
- Contact Page
- Please look at src/app/AIStudio/route to see how routes are handled

# Component Framework
Move all components into one centralized place and export them all into a context
- This will allow to have an API Framework for Third party apps where they create a function
```tsx
function ThirdPartyApp({components, context, router}) {
    const {AppMenu} = components
    return <div>
        <AppMenu>
         ... app menu items here
        </AppMenu>
        My custom app
    </div>
}
```