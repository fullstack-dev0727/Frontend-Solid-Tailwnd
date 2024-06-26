

export const Spinner = (props: {
    height?: string,
    width?: string,
    color?: string
}) => {
    return <svg class={`animate-spin -ml-1 mr-3 ${props.height || "h-7"} ${props.width || "w-7"} ${props.color || "text-gray-500"}`} xmlns="http://www.w3.org/2000/svg" fill="none" height="48px" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
}