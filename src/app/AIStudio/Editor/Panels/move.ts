import { ProviderGetSet } from "./types";

export function move(
	gs: ProviderGetSet,
	x: number,
	y: number,
	w: number,
	h: number
) {
	if (
		gs.get.left0 !== undefined &&
		gs.get.right0 !== undefined &&
		gs.get.x0 !== undefined
	) {
		if (x < 10) {
			gs.set("frameX", "left");
		} else if (x > w - 10) {
			gs.set("frameX", "right");
		} else {
			gs.set("frameX", undefined);
		}
		gs.set("panels", 0, "rect", "left", gs.get.left0 + x - gs.get.x0);
		gs.set("panels", 0, "rect", "right", gs.get.right0 + x - gs.get.x0);
	}
	if (
		gs.get.top0 !== undefined &&
		gs.get.bottom0 !== undefined &&
		gs.get.y0 !== undefined
	) {
		if (y < 10) {
			gs.set("frameY", "top");
		} else if (y > h - 10) {
			gs.set("frameY", "bottom");
		} else {
			gs.set("frameY", undefined);
		}
		gs.set("panels", 0, "rect", "top", gs.get.top0 + y - gs.get.y0);
		gs.set("panels", 0, "rect", "bottom", gs.get.bottom0 + y - gs.get.y0);
	}
}
