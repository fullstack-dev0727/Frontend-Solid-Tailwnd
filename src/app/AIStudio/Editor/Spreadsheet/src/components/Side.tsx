import { Component, createEffect, For } from "solid-js"
import { generationRows } from "../../../GenerateButton"
import { cacheIndices } from "../../../generateVideos"
import { THUMBNAIL_HEADER, VIDEO_HEADER } from "../../../state"
import { styles } from "../styles"
import { SheetGetSet } from "../types"
import {
	isInRange,
	setCell,
	setSelected,
	setSelection,
	startSelecting,
	template,
} from "../utils"

export const Side: Component<SheetGetSet> = (props) => {
	return (
		<div style={{ overflow: "hidden" }}>
			<div
				style={{
					display: "grid",
					"margin-top": props.get.offsetTop + "px",
					"grid-template-rows": template(props.get.heights),
					"grid-template-columns": "50px",
					"z-index": Number.MAX_SAFE_INTEGER,
				}}
			>
				<For each={props.get.heights}>
					{(_, i) => {
						const y = () => props.get.scrollY + i()

						const hydrate = (y: number) => {
							if (y === 0) return

							const generatedVideo = generationRows[cacheIndices()[y]]

							if (props.get.rows[0]) {
								for (const [x, cell] of Object.entries(props.get.rows[0])) {
									const isVideo = cell.content === VIDEO_HEADER
									const isThumbnail = cell.content === THUMBNAIL_HEADER
									if (!isVideo && !isThumbnail) continue

									const current = props.get.rows[y]?.[+x]
									if (!generatedVideo) {
										if (current?.url || current?.content) {
											setCell(props, +x, y, { url: "", content: "" })
										}
										continue
									}

									const { vimeo_url, thumbnail, status } = generatedVideo

									const url = isVideo ? vimeo_url : thumbnail
									const content = url ?? status
									const currentAudio = props.get.rows[y]?.[+x - 1]

									if (!currentAudio) continue
									// if (!current) continue
									if (current?.content === content && current?.url === url)
										continue
									console.log("UPDATE CELLS DUE TO DELTA")
									setCell(props, +x, y, {
										url,
										content,
									})
								}
							}
						}

						createEffect(() => {
							hydrate(y())
						})

						const selection = () =>
							isInRange(y(), props.get.selectedY, props.get.selectionY)
						const selected = () =>
							selection() && !isFinite(props.get.selectionX)
						// const resizing = () => props.get.resizeX === y()
						const title = () => (y() ? y().toString() : "@")
						return (
							<div
								onPointerOver={(e) => {
									e.preventDefault()
									if (props.get.selecting) setSelection(props, Infinity, y())
								}}
								style={{
									display: "flex",
									"margin-bottom": "-1px",
									"z-index": 100,
									background: selected()
										? styles.active.border
										: selection()
										? styles.highlight.bg
										: "white",
									border: `1px ${styles.normal.border} solid`,
									color: selected() ? "white" : "black",
								}}
							>
								<div
									onPointerDown={(e) => {
										e.preventDefault()
										startSelecting(props)
										setSelected(props, 0, y())
										setSelection(props, Infinity, y())
									}}
									title={title()}
									style={{
										"justify-content": "center",
										"align-items": "center",
										display: "flex",
										"flex-grow": 1,
										"white-space": "nowrap",
										"text-overflow": "ellipsis",
										overflow: "hidden",
									}}
								>
									{title()}
									{/* {" "}
									<Show when={link()}>
										<a
											href={link()}
											target="_blank"
											class="hover:text-blue-500"
										>
											<PlayIcon />
										</a>
									</Show> */}
								</div>
							</div>
						)
					}}
				</For>
			</div>
		</div>
	)
}
