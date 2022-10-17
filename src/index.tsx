/* @refresh reload */
import { render } from "solid-js/web"

// import "tailwindcss/tailwind.css";
import App from "./App"
import { Router } from "solid-app-router"

import "./main.css"
import "./lion-skin.css"

render(
	() => (
		<Router>
			<App />
		</Router>
	),
	document.getElementById("root") as HTMLElement
)
