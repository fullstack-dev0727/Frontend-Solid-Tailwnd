// Returns time difference between current time and parameter(Date object) in string
export const formatLastModified = (time: Date, short?: boolean) => {
	if (!time) return ""
	const date = new Date(time)
	const now = new Date()

	now.setTime(now.getTime() + now.getTimezoneOffset() * 60 * 1000) // set user timezone to UTC

	let seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
	if (seconds < 61) return short ? seconds + "s" : seconds + "s ago"
	else if (seconds < 3600)
		return short
			? Math.floor(seconds / 60) + "min ago"
			: Math.floor(seconds / 60) + "m"
	else if (seconds < 86400)
		return short
			? Math.floor(seconds / 3600) + " hour ago"
			: Math.floor(seconds / 3600) + "h"
	else if (seconds < 604800)
		return short
			? Math.floor(seconds / 86400) + " day ago"
			: Math.floor(seconds / 86400) + "d"
	else
		return short
			? Math.floor(seconds / 604800) + " week ago"
			: Math.floor(seconds / 604800) + "w"
}
