export function parseDuration(duration: string): number {
	const [full, ms = 0] = duration.split(";")
	return (
		full
			.split(":")
			.reverse()
			.reduce((t, v, i) => {
				return t + +v * 60 ** i
			}, 0) +
		+ms / 1000
	)
}

export function formatDuration(duration: number, withMs = true): string {
	const parts: number[] = []
	const full = Math.floor(duration)
	const ms = (duration - full) * 1000
	const ms_part =
		ms === 0 || !withMs ? "" : ";" + ms.toFixed(0).padStart(3, "0")
	duration = full
	if (duration === 0) parts.unshift(0)
	for (let i = 0; duration > 0; i++) {
		const m = 60 ** i
		const n = Math.floor(duration / m)
		duration -= n * m
		parts.unshift(n)
	}
	return parts.join(":") + ms_part
}

export const getVideoDuration = (blob: Blob) =>
	new Promise<number>((resolve) => {
		const video = document.createElement("video")
		video.src = URL.createObjectURL(blob)
		video.onloadedmetadata = () => {
			const duration = video.duration
			video.src = ""
			resolve(duration)
		}
	})

const convertMilliSecToTime = (milliSeconds: number) => {
	let seconds = Math.floor(milliSeconds / 1000)
	milliSeconds = Math.floor(milliSeconds % 1000)
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds - hours * 3600) / 60)
	seconds = seconds - hours * 3600 - minutes * 60
	return { milliSeconds, seconds, minutes, hours }
}

export const responseFromMilliSeconds = (milliSeconds: number) => {
	const time = convertMilliSecToTime(milliSeconds)
	const milliSecArr = (Math.floor(time.milliSeconds) || 0).toString().split("")
	milliSecArr.splice(-1)
	const milliSec = milliSecArr.join("")
	const min = (Math.floor(time.minutes) || 0).toString()
	const sec = (Math.floor(time.seconds) || 0).toString()
	const hour = (Math.floor(time.hours) || 0).toString()

	const Z = (exp: string) => (exp.length === 1 ? "0" + exp : exp)
	if (milliSec) {
		return Z(hour) + ":" + Z(min) + ":" + Z(sec) + ":" + Z(milliSec)
	} else {
		return Z(hour) + ":" + Z(min) + ":" + Z(sec) + ":" + "00"
	}
}

//@ts-ignore
export const getArrayItemWithKeyAndValue = (arr, key, value) => {
	var obj = null
	if (!arr) return obj
	//@ts-ignore
	arr.map((a, i) => {
		if (a[key].toLowerCase() === value.toLowerCase()) obj = a
	})
	return obj
}

//@ts-ignore
export const isArrayIncludesItemWithKey = (arr, key) => {
	var check = false
	if (!arr) return check
	//@ts-ignore
	arr.map((a, i) => {
		if (a[key]) check = true
	})
	return check
}

//@ts-ignore
export const hasArrayDifferentValueWithKey = (arr, key) => {
	var check = false
	if (!arr) return true
	else if (arr.length === 1) return false
	const value = arr[0][key]
	//@ts-ignore
	arr.slice(1, arr.length).forEach((a, i) => {
		if (a[key] !== value) check = true
	})
	return check
}
