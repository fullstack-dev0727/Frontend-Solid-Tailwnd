export const LikeIcon = (props: { active?: boolean; size?: string }) => (
	<svg
		width="20"
		height="17"
		viewBox="0 0 20 17"
		fill={props?.active ? "red" : "none"}
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M6.25008 1.33331C3.71883 1.33331 1.66675 3.3854 1.66675 5.91665C1.66675 10.5 7.08341 14.6666 10.0001 15.6358C12.9167 14.6666 18.3334 10.5 18.3334 5.91665C18.3334 3.3854 16.2813 1.33331 13.7501 1.33331C12.2001 1.33331 10.8292 2.1029 10.0001 3.28081C9.57745 2.67882 9.01598 2.18752 8.36322 1.84852C7.71046 1.50952 6.98562 1.33279 6.25008 1.33331Z"
			stroke={props?.active ? "red" : "black"}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
)
