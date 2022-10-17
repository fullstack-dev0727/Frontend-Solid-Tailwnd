import { state } from "./state"

import timeline from "canvas_timeline/src/settings/timeline"
import cursor from "canvas_timeline/src/settings/cursor"
import ruler from "canvas_timeline/src/settings/ruler"
import viewport from "canvas_timeline/src/settings/viewport"
import scroll from "canvas_timeline/src/settings/scroll_bars"
import tracks from "canvas_timeline/src/settings/tracks"
import clips from "canvas_timeline/src/settings/clips"

import { createEffect } from "solid-js"

export function configureTimeline() {
	cursor.border_color = "#5A5A5A"
	cursor.width = 10
	cursor.height.rectangle = 0
	cursor.height.triangle = 10
	cursor.time_code.text.color = "black"
	cursor.foreground_color = "white"
	cursor.time_code.text.color = "transparent"

	timeline.background_color = "#FFF"

    ruler.background_color = "#FFF"
	ruler.ticks.background_color = "#FFF"
	ruler.text.font.size = 15
	ruler.text.color = "black"
	
    
    viewport.background_color = "transparent"
    
    scroll.foreground_color = "grey"
	scroll.horizontal.height = 10
	scroll.vertical.width = 10

	tracks.background_color = "#00000014"
	tracks.text.color = "black"
	
	clips.color = "#DA5597"
	clips.resize_handles.color = "yellow"
}

createEffect(() => {
	timeline.height = state.timelineHeight
})
