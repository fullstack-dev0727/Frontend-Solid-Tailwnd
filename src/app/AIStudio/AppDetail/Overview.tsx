import Files from "./Files"
import Videos from "./Videos"

export const Overview = () => {
	return (
		<section class="grid gap-3">
			{/*<Analytics />*/}
			<Videos />
			{/*<Comments />*/}
			<Files />
		</section>
	)
}

export default Overview
