import { ComponentProps, createSignal, ParentProps } from "solid-js"
import { SolidApexCharts } from "solid-apexcharts"

type ChartGraphProps<P = {}> = P & {
	styled?: boolean
}

export const ChartGraph = (
	_props: ParentProps<ChartGraphProps<ComponentProps<"div">>>
) => {
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

	const [options] = createSignal({
		chart: {
			id: "solidchart-example",
			type: "area",
			width: "100%",
			height: 200,
			stacked: true,
			events: {
				selection: function (_chart: any, _e: any) {
					// console.log(new Date(e.xaxis.min))
				},
			},

			zoom: {
				enabled: true,
			},

			toolbar: {
				show: false,
				tools: {
					download: false,
					selection: false,
					zoom: false,
					zoomin: true,
					zoomout: true,
					pan: true,
					customIcons: [],
				},
			},
		},
		xaxis: {
			type: "datetime",
			// categories: ['Monday', 'Tuesday', 'Thusday', 'Friday', 'Saturday'],
			labels: {
				show: true,
				formatter: function (val: number) {
					// console.log("formattre ;;;:", days[new Date(val).getDay()])

					return days[new Date(val).getDay()]
				},
				style: {
					colors: ["#000000"],
					fontSize: "13px",
					fontFamily: "Inter",
					fontWeight: 400,
				},
			},
			tickAmount: 7,
			offsetX: 30,
		},

		yaxis: {
			labels: {
				formatter: function (val: number) {
					return val >= 1000 ? (val / 1000).toFixed(0) + "K" : val
				},
				style: {
					colors: ["#000000"],
					fontSize: "13px",
					fontFamily: "Inter",
					fontWeight: 400,
				},
			},
			tickAmount: 5,
		},

		stroke: {
			curve: "smooth",
			width: "1",
		},
		dataLabels: {
			enabled: false,
		},
		fill: {
			type: "gradient",
			gradient: {
				opacityFrom: 0.6,
				opacityTo: 0,
			},
		},
		tooltip: {
			enabled: false,
		},
		colors: ["#0096C7"],
	})
	const [series, setSeries] = createSignal({
		list: [
			{
				name: "View",
				data: [],
			},
		],
	})
	function getSeriesList() {
		const nowDate = new Date()
		var fromDate = new Date()

		fromDate.setDate(nowDate.getDate() - 7)
		let resultList = []
		for (var d = fromDate; d < nowDate; d.setHours(d.getHours() + 5)) {
			resultList.push({
				x: d.getTime(),
				y: Math.floor(Math.random() * 5000) + 3000,
			})
		}
		console.log("resultList==== ", resultList)
		setSeries({
			list: [
				{
					name: "View",
					data: resultList,
				},
			],
		})
		var itemValue = Math.floor(Math.random() * 10000) + 1
		console.log(itemValue)
	}
	getSeriesList()

	return (
		<div class="overflow-hidden">
			<SolidApexCharts
				type="area"
				options={options()}
				series={series().list}
			/>
		</div>
	)
}
