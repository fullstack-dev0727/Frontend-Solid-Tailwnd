// module.exports = {
// 	purge: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
// 	content: [],
// 	theme: {
// 	  extend: {},
// 	},
// 	plugins: [],
//   }

const defaultTheme = require("tailwindcss/defaultTheme")

const boxShadow = {
	sm: "0 1px 2px -1px rgba(0,0,0,0.3)",
	md: `
    0 3px 5px -2px rgba(0,0,0,0.3),
    0 7px 14px -5px rgba(0,0,0,0.3)`,
	lg: `
    0 -1px 3px 0 rgba(0,0,0,0.3),
    0 1px 2px -5px rgba(0,0,0,0.3),
    0 2px 5px -5px rgba(0,0,0,0.3),
    0 4px 12px -5px rgba(0,0,0,0.3),
    0 12px 15px -5px rgba(0,0,0,0.3)`,
	xl: `
    0 -2px 5px 0 rgba(0,0,0,0.3),
    0 1px 1px -2px rgba(0,0,0,0.3),
    0 2px 2px -2px rgba(0,0,0,0.3),
    0 5px 5px -2px rgba(0,0,0,0.3),
    0 9px 9px -2px rgba(0,0,0,0.3),
    0 16px 16px -2px rgba(0,0,0,0.3)`,
	"2xl": `
    0 -1px 2px 0 rgba(0,0,0,0.3),
    0 2px 1px -2px rgba(0,0,0,0.3),
    0 5px 5px -2px rgba(0,0,0,0.3),
    0 10px 10px -2px rgba(0,0,0,0.3),
    0 20px 20px -2px rgba(0,0,0,0.3),
    0 40px 40px -2px rgba(0,0,0,0.3)`,
	"3xl": `
    0 -1px 2px 0 rgba(0,0,0,0.3),
    0 3px 2px -2px rgba(0,0,0,0.3),
    0 7px 5px -2px rgba(0,0,0,0.3),
    0 12px 10px -2px rgba(0,0,0,0.3),
    0 22px 18px -2px rgba(0,0,0,0.3),
    0 41px 33px -2px rgba(0,0,0,0.3),
    0 100px 80px -2px rgba(0,0,0,0.3)`,
	"sm-inner": "inset 0 0 0 1px rgba(0,0,0,0.3)",
	"md-inner": "inset 0 1px 2px 0 rgba(0,0,0,0.3)",
	"lg-inner": "inset 0 1px 4px 0 rgba(0,0,0,0.3)",
	"xl-inner": "inset 0 2px 8px 0 rgba(0,0,0,0.3)",
	"2xl-inner": "inset 0 2px 14px 0 rgba(0,0,0,0.3)",
}

const metalGray = {
	100: "#D8E8F4",
	200: "#ACC9E0",
	300: "#A2BFD5",
	400: "#8CADC6",
	500: "#7195B1",
	600: "#597F9D",
	700: "#466E8C",
	800: "#335B79",
	900: "#264D6B",
	1000: "#143955",
	a00: "#0B2C45",
	b00: "#08253C",
	c00: "#062135",
	d00: "#03192B",
	e00: "#02121E",
	f00: "#00090F",
}
module.exports = {
	purge: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/file-manager-ui/**/*{js,ts,jsx,tsx}",
	],
	content: [
		"./src/views/**/*.tsx",
		"./src/ui/**/*.tsx",
		"./src/assets/icons/*.tsx",
		"./node_modules/file-manager-ui/src/index.tsx",
	],
	variants: {
		visibility: ["group-hover", "active", "group-active"],
	},
	theme: {
		extend: {
			colors: {
				metalGray,
			},
			fontFamily: {
				sans: ["Manrope", ...defaultTheme.fontFamily.sans],
			},
			// screens: {
			// 	xxs: { max: "360px" },
			// 	xs: { max: "480px" },
			// 	sm: { max: "639px" },
			// 	md: { max: "767px" },
			// 	lg: { max: "1023px" },
			// 	xl: { max: "1279px" },
			// 	"2xl": { max: "1534px" },
			// 	"3xl": { max: "1919px" },
			// },
			boxShadow,
			keyframes: {
				"fade-in-down": {
					"0%": {
						opacity: "0",
					},
					"100%": {
						opacity: "1",
					},
				},
				"move-bg": {
					to: {
						backgroundPosition: "400% 0",
					},
				},
				"pop-out": {
					"0%": {
						transform: "scale(0)",
					},
					"100%": {
						transform: "scale(1)",
					},
				},
			},
			animation: {
				"fade-in-down": "fade-in-down 0.6s ease-in-out",
				"delayed-fade-in-down": "fade-in-down 1.3s ease-in-out",
				"move-bg": "move-bg 8s infinite linear",
				"pop-out": "pop-out 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
			},
			transitionTimingFunction: {
				"in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
				"out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
				10: "cubic-bezier(.25, 0, .5, 1)",
				20: "cubic-bezier(.25, 0, .4, 1)",
				30: "cubic-bezier(.25, 0, .3, 1)",
				40: "cubic-bezier(.25, 0, .2, 1)",
				50: "cubic-bezier(.25, 0, .1, 1)",
				"in-10": "cubic-bezier(.25, 0, 1, 1)",
				"in-20": "cubic-bezier(.50, 0, 1, 1)",
				"in-30": "cubic-bezier(.70, 0, 1, 1)",
				"in-40": "cubic-bezier(.90, 0, 1, 1)",
				"in-50": "cubic-bezier(1, 0, 1, 1)",
				"out-10": "cubic-bezier(0, 0, .75, 1)",
				"out-20": "cubic-bezier(0, 0, .50, 1)",
				"out-30": "cubic-bezier(0, 0, .3, 1)",
				"out-40": "cubic-bezier(0, 0, .1, 1)",
				"out-50": "cubic-bezier(0, 0, 0, 1)",
				"in-out-10": "cubic-bezier(.1, 0, .9, 1)",
				"in-out-20": "cubic-bezier(.3, 0, .7, 1)",
				"in-out-30": "cubic-bezier(.5, 0, .5, 1)",
				"in-out-40": "cubic-bezier(.7, 0, .3, 1)",
				"in-out-50": "cubic-bezier(.9, 0, .1, 1)",
				"elastic-10": "cubic-bezier(.5, .75, .75, 1.25)",
				"elastic-20": "cubic-bezier(.5, 1, .75, 1.25)",
				"elastic-30": "cubic-bezier(.5, 1.25, .75, 1.25)",
				"elastic-40": "cubic-bezier(.5, 1.5, .75, 1.25)",
				"elastic-50": "cubic-bezier(.5, 1.75, .75, 1.25)",
				"squish-10": "cubic-bezier(.5, -.1, .1, 1.5)",
				"squish-20": "cubic-bezier(.5, -.3, .1, 1.5)",
				"squish-30": "cubic-bezier(.5, -.5, .1, 1.5)",
				"squish-40": "cubic-bezier(.5, -.7, .1, 1.5)",
				"squish-50": "cubic-bezier(.5, -.9, .1, 1.5)",
				"step-10": "steps(2)",
				"step-20": "steps(3)",
				"step-30": "steps(4)",
				"step-40": "steps(7)",
				"step-50": "steps(10)",
				snappy: "cubic-bezier(.2,.8,.4,1)",
				swift: "cubic-bezier(0.175,0.885,0.32,1.275)",
			},
		},
	},
	plugins: [
		//require("@tailwindcss/forms"),
		require("@tailwindcss/line-clamp"),
	],
}
