import { StaticIcon } from "./types"

export const EditIcon: StaticIcon = (props) => {
	return (
		<div class="w-[16px] h-[16px] flex">
			<svg
				class="m-auto"
				width={props.size}
				height={props.size}
				viewBox="0 0 12 12"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					class="fill-[#4EADF1] group-hover:fill-white group-active:fill-white"
					d="M10.9333 2.89336L9.10662 1.06669C8.86821 0.842758 8.55581 0.714267 8.22884 0.705662C7.90187 0.697058 7.58314 0.80894 7.33329 1.02003L1.33329 7.02003C1.1178 7.23734 0.983623 7.52216 0.953287 7.82669L0.66662 10.6067C0.65764 10.7043 0.67031 10.8028 0.703728 10.895C0.737146 10.9871 0.790488 11.0708 0.859954 11.14C0.922247 11.2018 0.996124 11.2507 1.07735 11.2839C1.15857 11.3171 1.24555 11.3339 1.33329 11.3334H1.39329L4.17329 11.08C4.47782 11.0497 4.76264 10.9155 4.97995 10.7L10.98 4.70003C11.2128 4.45401 11.3387 4.1257 11.3299 3.78705C11.3212 3.4484 11.1786 3.12703 10.9333 2.89336ZM4.05329 9.74669L2.05329 9.93336L2.23329 7.93336L5.99995 4.21336L7.79995 6.01336L4.05329 9.74669ZM8.66662 5.12003L6.87995 3.33336L8.17995 2.00003L9.99995 3.82003L8.66662 5.12003Z"
					fill="white"
				/>
			</svg>
		</div>
	)
}
