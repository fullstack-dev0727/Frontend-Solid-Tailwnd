import { Component, createEffect, createSignal, Match, on, Show, Switch } from "solid-js"

import { EditIconButton } from "@/ui/AppMenu/EditIconButton"
import { useNavigate } from "solid-app-router"
import { state } from "../state"

type VideoPlayProps = {
	name: string
	time: string
	videoUrl: string
	shortUrl: string
	thumbUrl: string
}

export const VideoPlay: Component<VideoPlayProps> = (props) => {
	const navigate = useNavigate()
	const [playing, setPlaying] = createSignal(false)

	let canvas!: HTMLCanvasElement
	let ctx!: CanvasRenderingContext2D
	let video!: HTMLVideoElement

	createEffect(on([() => props.videoUrl], () => {
		setPlaying(false)

		if (props.videoUrl) {
			video = document.createElement("video")
			if (video) {
				ctx = canvas.getContext("2d")
				video = document.createElement("video")
				video.src = props.videoUrl
				video.load()

				video.onloadeddata = () => {
					video.currentTime = 0
					ctx.drawImage(video, 0, 0)
				}

				video.oncanplay = () => {
					canvas.height = video.videoHeight
					canvas.width = video.videoWidth
					updateCanvas()
				}
				video.onended = () => setPlaying(false)
			}
		}
	}))

	const PlayButton = () => {
		return (
			<div>
				<svg
					width="31"
					height="32"
					viewBox="0 0 31 32"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M4.75 0.412004L29.167 13.117C29.6945 13.3915 30.1366 13.8055 30.4451 14.3138C30.7536 14.8221 30.9167 15.4054 30.9167 16C30.9167 16.5946 30.7536 17.1779 30.4451 17.6862C30.1366 18.1946 29.6945 18.6085 29.167 18.883L4.75 31.588C4.25463 31.8457 3.70122 31.9715 3.14312 31.9531C2.58502 31.9347 2.04107 31.7729 1.56372 31.4832C1.08636 31.1934 0.691711 30.7856 0.417816 30.299C0.143921 29.8124 2.42871e-05 29.2634 1.21785e-07 28.705V3.295C-0.000147588 2.75538 0.134072 2.22421 0.390548 1.74943C0.647023 1.27466 1.01768 0.871214 1.46907 0.575512C1.92046 0.279811 2.43838 0.101158 2.97608 0.0556775C3.51379 0.0101973 4.05435 0.0993202 4.549 0.315004L4.75 0.412004Z"
						fill="white"
					/>
				</svg>
			</div>
		)
	}

	const updateCanvas = () => {
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		video.requestVideoFrameCallback(updateCanvas);
	};

	function play() {
		if (video) {
			video.play()
			setPlaying(true)
		}
	}

	function stop() {
		if (video) {
			video.pause()
			setPlaying(false)
		}
	}

	return (
		<div class="px-[16px]">
			<div class="relative">
				<Switch>
					<Match when={props.videoUrl === ""}>
						<div class="bg-blue-900 text-white font-mono h-60 rounded-[48px] flex justify-center items-center">
							Click edit to get started!
						</div>
					</Match>
					<Match when={props.videoUrl != ""}>
						<div onclick={() => !playing() ? play() : stop()}>
							<div class="text-white font-mono rounded-[48px] flex justify-center items-center">
								<canvas
									class="w-full rounded-[48px]"
									ref={canvas}
								/>
							</div>
							<Show when={!playing()}>
								<div class="absolute inset-0 w-full h-full flex bg-black/[0.32] rounded-[48px]">
									<div class="m-auto cursor-pointer">
										<PlayButton />
									</div>
								</div>
							</Show>
						</div>
					</Match>
				</Switch>
			</div>
			<div class="mt-[16px] flex justify-between">
				<div class="select-text">
					<div class="font-[Inter] text-[17px] leading-[20px] font-medium text-black/[0.9]">
						{props.name}
					</div>
					<div class="mt-[12px] font-[Inter] text-[15px] leading-[18px] font-medium text-black/[0.6] flex gap-1.5">
						{/*<div class="cursor-pointer">{count} views</div>
						<div class="w-[2px] h-[2px] rounded-full my-auto mx-[6px] bg-black/[0.6]"></div>
						*/}
						<div>{props.time}</div>
					</div>
				</div>
				<div>

				</div>
				<div class="ml-[16px]">
					<EditIconButton
						active={false}
						onClick={() => navigate("./editor/" + state.currentVideo)}
					/>
				</div>
			</div>
		</div>
	)
}
