export type SheetInfo = {
	name: string
	number: number
}

export type ClientInfo = {
	name: string
	user_id: string
	hue: number
}

export type CursorInfo = {
	cursors: [number, number, number]
}

export type CellInfo = {
	position: [number, number, number]
	cell_type: string
	content: string
}

export type ClientMessage = {
	ClientInfo: ClientInfo
	CursorData: CursorInfo
	CreateSheet: SheetInfo
	RenameSheet: SheetInfo
	DeleteSheet: SheetInfo
	WriteCell: CellInfo
	DeleteCell: CursorInfo
}

export type ServerMessage = {
	Identity: number
	UserInfo: {
		id: number
		info: ClientInfo
	}
	UserCursor: {
		id: number
		data: CursorInfo
	}
	CreateSheet: {
		id: number
		sheet: SheetInfo
	}
	DeleteSheet: {
		id: number
		sheet: SheetInfo
	}
	RenameSheet: {
		id: number
		sheet: SheetInfo
	}
	GetSheet: {
		sheet: SheetInfo
	}
	WriteCell: {
		id: number
		cell: CellInfo
	}
	DeleteCell: {
		id: number
		cursor: CursorInfo
	}
	GetCell: {
		cell: CellInfo
	}
	BatchCell: {
		cells: CellInfo[]
	}
	BatchSheet: {
		sheets: SheetInfo[]
	}
}
