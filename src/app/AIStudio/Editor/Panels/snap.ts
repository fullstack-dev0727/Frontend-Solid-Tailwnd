import { ProviderGetSet } from "./types";

export function snap(gs: ProviderGetSet, w: number, h: number) {
	if (gs.get.frameX === "left") {
		gs.set("panels", 0, "rect", "left", 0);
		gs.set("panels", 0, "rect", "right", w / 2);
	} else if (gs.get.frameX === "right") {
		gs.set("panels", 0, "rect", "left", w / 2);
		gs.set("panels", 0, "rect", "right", w);
	} else if (gs.get.frameY) {
		gs.set("panels", 0, "rect", "left", 0);
		gs.set("panels", 0, "rect", "right", w);
	}

	if (gs.get.frameY === "top") {
		gs.set("panels", 0, "rect", "top", 0);
		gs.set("panels", 0, "rect", "bottom", h / 2);
	} else if (gs.get.frameY === "bottom") {
		gs.set("panels", 0, "rect", "top", h / 2);
		gs.set("panels", 0, "rect", "bottom", h);
	} else if (gs.get.frameX) {
		gs.set("panels", 0, "rect", "top", 0);
		gs.set("panels", 0, "rect", "bottom", h);
	}

	gs.set("frameX", undefined);
	gs.set("frameY", undefined);
}
