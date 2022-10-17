# Frontend Wireframe

This application is designed to be as scalable as possible.

- Dynamically loading user apps from the backend
- Exposing all the common components to the loaded apps
- All exposed components are stateless and reactive (via AccessorComponent)

## Creating a reactive stateless component

By stateless, it means that the component does not call `createSignal` or `createStore`.

### Creating a reactive component...

```tsx
export const MyReactiveComponent: Component<{ value: string }> = (props) => {
	return (
		<div>
			<p>
				The moment a dependency within reactive changes, I will immediately
				update...
				{props.value}
			</p>
		</div>
	)
}
```

**Warning! Do not destructure the props like we do in React. It removes its reactivity because props is something that Solid.js keeps track**

## Creating an application

As of now, applications are created inside the `src/app` directory. It will most like change in the future because everything in one central location is not great...

To create an application:

- Create a folder with the name of the application (application-id)
- Add route.ts to the define the routes to be mounted of the application for `solid-app-router`
- Create index.ts which will be imported by routes. (This will soon change)

## About Application State and Integration

Please avoid as much as possible altering the state of the UI without using the store. Therefore please avoid:

- Fetching data within a component

## Available Components

- AppMenu
- Icons...

While creating an app, please make your components as generic as possible (via AccessorComponent)

## Plans for Third Party Applications

When the client loads, it will fetch all applications used/enabled by the user. The backend will return a list of `AppInfo` which will then be mounted when used.

The applications will be simple scripts evaluated by the browser. Indeed, `eval` is not good, therefore, we will use `new Function` instead. The function will expose as parameters to its body (the application script), things that the application may need such as the components.

To make sure that no unwanted script will run, the `AppInfo` will contain the fingerprint(hash) of the bundled script. Therefore, no unverified code (via changes in the code) will be able to run. This will ensure that code that runs, is only the one we verified. Of course, it still does not prevent the third party from fetching from another source and running it. However, we will have more control on _first level scripts_.

From the third party integrators perpective, all components will be global objects, but in fact, the code is scoped within a Function.

To mount a UI component to the _Wireframe_

```tsx
mount(<div>My custom app</div>)
```

`mount` in this case will a a function param for `new Function`

# AI Studio Editor

The code in `src/app/AIStudio/Editor` might at first seem over complicated. However, it was done this way to be as performant as possible while remaining in the realm of JS. (No WASM).

Appenrently, in Chromium, reassigning `video.currentTime` is expensive and laggy probably due to the decoding process, hence doing it every frame to sync with the timeline is laggy.
- This explains the `needsRedraw` variable found in `Player.tsx`.
- Also, why the video is not following the timeline when it is in *play* mode; the opposite is true.

Also, `video.currentTime` is likely not a `float64`, hence comparing it with the computed timeline time `float64` will cause trouble even after assigning the video.currentTime to it.
- This explains the `Math.abs` when checking if the video currentTime should be reassigned.

After reassigning the `video.currentTime`, it is likely that the video has not yet loaded: it is not ready.
- Hence, the `needsRedraw` variable is set to true, which will then run the syncing once only if the video is ready.