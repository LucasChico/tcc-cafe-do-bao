export const Select = ({ className, label, options, value, onChange, disabled = false }) => {
    return (
        <div className={"form-select-container" + ' ' + className}>
            {label && <label className="form-label">{label}</label>}
            <select
                className="form-select"
                value={value || ''}
                onChange={onChange}
                disabled={disabled}
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
