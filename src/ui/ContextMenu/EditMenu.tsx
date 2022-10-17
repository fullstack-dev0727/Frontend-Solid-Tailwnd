
export const EditMenu = (props: {
    onChange: (value: string) => void,
    onHide?: () => void,
    value?: string,
    placeholder?: string,
    top?: string,
    left?: string,
    class?: string,
    inputClass?: string
}) => {
    return <div class={`p-2 absolute bg-white z-10 context-menu ${props.class}`} style={{
        top: props.top,
        left: props.left || "20px"
    }}>
        <input class={`rounded text-[13px] bg-gray-100 p-1 ${props.inputClass}`} ref={(el) => setTimeout(() => (el as unknown as HTMLInputElement).focus(), 0)} maxLength={60} placeholder={props.placeholder} value={props.value} onInput={(el) => {
            props.onChange((el.target as HTMLInputElement).value);
        }} onBlur={props.onHide} />
    </div>
}