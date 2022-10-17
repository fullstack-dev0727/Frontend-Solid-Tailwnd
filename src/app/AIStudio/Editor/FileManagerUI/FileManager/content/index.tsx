import { FileData } from ".."
import {
	DataTable,
	DataTableHeaderResizeInfo,
	HeaderSortState,
} from "../../DataTable"
import { File } from "./file"
import { UploadingFile } from "./uploadingFile"
import { setFiles } from "@/app/AIStudio/Editor/state"
import { createSignal, Setter } from "solid-js"
import { uploadAny } from "@/app/AIStudio/Editor/api"
import { state } from "@/app/AIStudio/state"
import { loadAssets } from "../loader"

async function upload(file: File, setProgress: Setter<number>) {
	console.log(state.currentVideo)
	const feedback = await uploadAny(state.currentVideo, file, (e) =>
		setProgress((e.loaded * 100) / e.total)
	)

	if (feedback.type === "error") {
		return console.error("something went wrong while uploading", file)
	}

	setFiles((files) =>
		files.map((f) => {
			return {
				...f,
				uploading: false,
			}
		})
	)

	loadAssets()


}

const [progress, setProgress] = createSignal(0)

export const onFileDrop = (file: File) => {
	const [name, extension] = file.name.split(".")
	setFiles((files) => [
		{
			id: "",
			name,
			extension,
			dateCreated: new Date(file.lastModified),
			size: file.size / 1000,
			uploading: true,
			file,
		},
		...files,
	])
	upload(file, setProgress)
}

export const FileManagerContent = (props: { files: FileData[] }) => {
	const resolveFields = (item: FileData, resize: DataTableHeaderResizeInfo) => {
		if (item.uploading)
			return (
				<UploadingFile
					file={item}
					resize={resize}
					progress={progress()}
				/>
			)
		else
			return (
				<File
					file={item}
					resize={resize}
				/>
			)
	}

	return (
		<DataTable<FileData>
			data={props.files}
			headers={[
				{
					name: "Name",
					sort: (sortState, files) => {
						if (sortState === HeaderSortState.SortingAscending)
							return [...files.sort((a, b) => b.name.localeCompare(a.name))]
						else return [...files.sort((a, b) => a.name.localeCompare(b.name))]
					},
				},
				{
					name: "Date Created",
					sort: (sortState, files) => {
						if (sortState === HeaderSortState.SortingAscending)
							return [
								...files.sort(
									(a, b) => a.dateCreated.getTime() - b.dateCreated.getTime()
								),
							]
						else
							return [
								...files.sort(
									(a, b) => b.dateCreated.getTime() - a.dateCreated.getTime()
								),
							]
					},
				},
				// {
				// 	name: "Size",
				// 	sort: (sortState, files) => {
				// 		if (sortState === HeaderSortState.SortingAscending)
				// 			return [...files.sort((a, b) => a.size - b.size)]
				// 		else return [...files.sort((a, b) => b.size - a.size)]
				// 	},
				// },
				// {
				// 	name: "Duration",
				// 	sort: (sortState, files) => {
				// 		if (sortState === HeaderSortState.SortingAscending)
				// 			return [
				// 				...files.sort((a, b) => {
				// 					if (!a.duration) return 1
				// 					else if (!b.duration) return -1
				// 					return a.duration - b.duration
				// 				}),
				// 			]
				// 		else
				// 			return [
				// 				...files.sort((a, b) => {
				// 					if (!a.duration) return -1
				// 					else if (!b.duration) return 1
				// 					return b.duration - a.duration
				// 				}),
				// 			]
				// 	},
				// 	noResize: true,
				// },
			]}
			onFileDragOver={() => {
				console.log("File is being dragged over!")
			}}
			onFileDrop={onFileDrop}
			resolveData={resolveFields}
			filterUnsorted={(item) => !!item.uploading}
		/>
	)
}
