import { createEffect } from "solid-js";
import { SetStoreFunction, Store } from "solid-js/store";
import { MuxData, MuxGetSet } from "..";

export class MuxUtils implements MuxGetSet {
	onSheetSelect: (i: number) => void = () => {};
	onCursorMove: (i: number, x: number, y: number) => void = () => {};
	onCellUpdate: (i: number, x: number, y: number) => void = () => {};

	constructor(
		public get: Store<MuxData>,
		public set: SetStoreFunction<MuxData>
	) {
		createEffect(() => {
			this.onSheetSelect(this.get.selected);
		});
		createEffect(() => {
			const sheet = this.getSelectedSheet();
			if (sheet) {
				this.onCursorMove(this.get.selected, sheet.selectedX, sheet.selectedY);
			}
		});
	}

	getSelectedSheet() {
		return this.get.sheets[this.get.selected];
	}

	removeSheet(i: number) {
		this.set(
			"sheets",
			this.get.sheets.filter((s) => s.id !== i)
		);
	}

	removeCursor(id: number) {
		for (let i = 0; i < this.get.sheets.length; i++) {
			this.set("sheets", i, "cursors", (cc) => cc.filter((c) => c.id !== id));
		}
	}

	updateCursor(
		id: number,
		sheet: number,
		x: number,
		y: number,
		name: string,
		hue: number
	) {
		if (
			this.get.sheets
				.find((s) => s.id === sheet)
				?.cursors.find((c) => c.id === id)
		) {
			this.set(
				"sheets",
				(s) => s.id === sheet,
				"cursors",
				this.get.sheets[sheet].cursors.map((c) =>
					c.id === id ? { ...c, x, y } : c
				)
			);
		} else {
			this.set(
				"sheets",
				(s) => s.id === sheet,
				"cursors",
				(sheets) => [...sheets, { id, x, y, name, hue }]
			);
		}
	}
}
