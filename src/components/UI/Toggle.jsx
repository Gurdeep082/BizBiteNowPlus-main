export default function Toggle({ checked, onChange, disabled = false, name }) {
    return (
        <button
            type="button"
            name={name}
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => !disabled && onChange(!checked)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${checked ? "bg-emerald-600" : "bg-slate-300"
                }`}
        >
            <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ${checked ? "translate-x-5" : "translate-x-0"
                    }`}
            />
        </button>
    );
}