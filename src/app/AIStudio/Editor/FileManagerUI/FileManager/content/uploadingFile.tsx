import { FileData } from ".."
import { DataTableHeaderResizeInfo } from "../../DataTable"
import { DataRowField } from "../../DataTable/dataRow"
import { IconContainer } from "../../IconContainer"
import { formatSize, getFileExtension } from "./file"

export const UploadingFile = (props: {
	file: FileData
	resize: DataTableHeaderResizeInfo
	progress: number
}) => {
	// The file will be uploaded in this component, and once uploaded, the "onFinish"
	// event will fire, and the FileManagerContent will remove the file from the uploading
	// array and place it in the regular files array.

	return (
		<>
			<DataRowField
				class="flex gap-1 min-w-[50px]"
				resize={props.resize[0]}
			>
				<IconContainer>{getFileExtension(props.file.extension)}</IconContainer>
				<div class="h-4 rounded bg-gray-200 w-full">
					<div
						class="bg-[#21DD61] h-full rounded transition-all"
						style={{ width: `${props.progress}%` }}
					></div>
				</div>
			</DataRowField>
			<DataRowField
				class="whitespace-nowrap overflow-hidden text-ellipsis min-w-[40px]"
				resize={props.resize[1]}
			>
				<p class="text-[13px] leading-4 font-medium text-gray-700">
					{Math.round(props.progress)}%
				</p>
			</DataRowField>
			<DataRowField
				class="whitespace-nowrap overflow-hidden text-ellipsis min-w-[30px]"
				resize={props.resize[2]}
			>
				<div class="flex-1 text-[13px] leading-4 font-medium text-gray-700 text-ellipsis whitespace-nowrap overflow-hidden min-w-0">
					<span class="whitespace-nowrap overflow-hidden text-ellipsis">
						{formatSize(props.file.size)}
					</span>
				</div>
			</DataRowField>
			<DataRowField
				class="min-w-[30px]"
				resize={props.resize[3]}
			>
				<p class="text-[13px] leading-4 font-medium text-gray-700">--</p>
			</DataRowField>
		</>
	)
}
