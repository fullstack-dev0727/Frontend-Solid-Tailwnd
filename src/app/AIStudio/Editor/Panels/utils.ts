import { Direction, XDirection, YDirection } from "./types";

const cardinal: Record<Direction, string> = {
	left: "w",
	right: "e",
	top: "n",
	bottom: "s",
} as const;

export function cursor(x?: XDirection, y?: YDirection) {
	if (x === undefined && y === undefined) return "default";
	return `${cardinal[y!] ?? ""}${cardinal[x!] ?? ""}-resize` ?? "pointer";
}
