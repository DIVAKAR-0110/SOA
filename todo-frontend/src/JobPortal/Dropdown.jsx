export default function Dropdown({
  label,
  value,
  options = [],
  onChange,
  disabled = false,
  required = false,
}) {
  return (
    <div className="dropdown-group">
      <label className={required ? "required" : ""}>{label}</label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">Select {label}</option>

        {Array.isArray(options) &&
          options.map((item, index) => (
            <option key={`${label}-${item.id ?? index}`} value={item.id}>
              {item.name}
            </option>
          ))}
      </select>
    </div>
  );
}
