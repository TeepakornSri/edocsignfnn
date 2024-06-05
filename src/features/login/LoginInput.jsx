export default function LoginInput({ placeholder, type = 'text', value, onChange }) {
    return (
        <input type={type} placeholder={placeholder}
            className="block w-[320px] rounded-xl px-4 py-3 outline-none border focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
            value={value}
            onChange={onChange} />

    )
}