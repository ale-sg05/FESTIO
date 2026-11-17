export default function ErrorMessage({ children }: { children: string }) {
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-pink-600">
      <svg
        className="h-4 w-4 text-pink-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9h.01M11 12h1v5h1M12 22a10 10 0 100-20 10 10 0 000 20z"
        />
      </svg>
      {children}
    </p>
  );
}
