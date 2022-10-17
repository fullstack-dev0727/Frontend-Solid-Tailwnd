import { audios } from "@/api2/ai_studio"
import { generateVoice } from "@/api2/ai_studio/generateAudio"
import { actorId } from "../ActorSelect"
import { CellData, MuxGetSet } from "../Spreadsheet/src"

export type Location = {
	s: number
	x: number
	y: number
}

export type Column = {
	header: string
	count: number
}

export function getSegmentedCells(
	muxGetSet: MuxGetSet,
	segmentNames: string[]
): [CellData[], Location[], Column[]] {
	const locations: Location[] = []
	const cells: CellData[] = []
	const columns: Column[] = []

	const sheet = muxGetSet.get.sheets.find(
		(s) => s.id === muxGetSet.get.selected
	)

	const sorted = Object.keys(sheet.rows).sort((a, b) => +a - +b)
	const minY = +sorted[1]
	const maxY = +sorted[sorted.length - 1]
	if (sheet.rows[0]) {
		for (const [x, cell] of Object.entries(sheet.rows[0])) {
			if (segmentNames.includes(cell.content)) {
				console.log("include", cell.content, minY, maxY)
				let filledRowCount = 0
				for (let y = minY; y <= maxY; y++) {
					const cell = sheet.rows[y]?.[+x]
					if (cell?.content) {
						filledRowCount += 1
						cells.push(cell)
						locations.push({ s: sheet.id, x: +x, y: +y })
					}
				}
				columns.push({ header: cell.content, count: filledRowCount })
			}
		}
	}

	return [cells, locations, columns]
}

export function getTranscripts(
	muxGetSet: MuxGetSet,
	segmentNames: string[]
): [string[], Location[]] {
	const [cells, locations] = getSegmentedCells(muxGetSet, segmentNames)
	return [cells.map((c) => c.content), locations]
}

export function setAudio(
	muxGetSet: MuxGetSet,
	urls: string[],
	locations: Location[]
) {
	console.log(urls)

	for (let i = 0; i < urls.length; i++) {
		const url = urls[i]

		const location = locations[i]
		console.log("setAudio", url, location)
		muxGetSet.set(
			"sheets",
			({ id }) => id === location.s,
			"rows",
			location.y,
			location.x,
			(cell) => {
				const data = { ...cell, url }
				muxGetSet.get.sheets
					.find(({ id }) => id === location.s)
					.onCellUpdate(location.x, location.y, data)
				return data
			}
		)
	}
}

export async function generateAudio(
	muxGetSet: MuxGetSet,
	segmentNames: string[],
	templateUrl: string
) {
	console.log(templateUrl)
	const [transcriptsDup] = getTranscripts(muxGetSet, segmentNames)
	const transcripts = [...new Set(transcriptsDup)]
	const results = await generateVoice(transcripts, templateUrl, import.meta.env.VITE_ASSETS_BUCKET)
	console.log(results)
	for (let i = 0; i < results.length; i++) {
		const result = results[i]
		if (!result || result.file_path.length == 0) continue
		const transcript = transcripts[i]
		audios.put({
			name: transcript,
			actor_id: actorId(),
			url: import.meta.env.VITE_ASSETS_BUCKET + "/" + result.file_path,
			audio_length: "00:00:00:00",
		})
	}
}
