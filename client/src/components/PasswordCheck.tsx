export default function PasswordCheck({
  checked,
  text,
}: {
  checked?: boolean;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-purple-900/60">
      <span
        className={`grid h-4 w-4 place-items-center rounded-full border ${
          checked
            ? "border-teal-600 bg-teal-600 text-white"
            : "border-purple-900/50"
        }`}
      >
        {checked && (
          <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.79L15.3 5.3a1 1 0 011.4 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>

      {text}
    </div>
  );
}
