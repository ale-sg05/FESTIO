import MainLayout from "@/layouts/Layout";
import EnterpriseList from "@/components/EnterpriseList";
import { api } from "@/lib/api";
import { useEffect, useState, useCallback } from "react";

function redactLine(line: string): string {
  // mask bearer tokens in headers
  line = line.replace(
    /("authorization"\s*:\s*")Bearer[^"}]+("?)/gi,
    "$1Bearer ****$2",
  );
  // mask any bearer token occurrences
  line = line.replace(/Bearer\s+[A-Za-z0-9\-\._~\+\/=]+/g, "Bearer ****");
  // mask long digit sequences (cards)
  line = line.replace(/\b\d{12,19}\b/g, "****");
  // partially mask emails
  line = line.replace(
    /([A-Za-z0-9._%+-])([A-Za-z0-9._%+-]*?)@([A-Za-z0-9.-]+\.[A-Za-z]{2,})/g,
    (_, f, _m, d) => {
      return `${f}***@${d}`;
    },
  );
  return line;
}

export default function EnterpriseDashboard() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await api.get("/logs?lines=200");
      const arr = resp?.data?.data;
      if (Array.isArray(arr)) {
        const sanitized = arr.map((s: string) => redactLine(String(s)));
        setLogs(sanitized);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error("API connection failed:", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  return (
    <MainLayout>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <EnterpriseList />

        <section className="mt-4 sm:mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-3 sm:mb-2">
            <h2 className="text-base sm:text-lg font-semibold">Server Logs</h2>
            <button
              onClick={() => void fetchLogs()}
              className="px-3 py-1.5 sm:py-1 bg-blue-600 text-white rounded text-sm sm:text-base hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          <div className="bg-slate-900 text-slate-100 p-3 sm:p-4 rounded max-h-64 sm:max-h-80 lg:max-h-96 overflow-auto">
            {logs.length === 0 ? (
              <div className="text-sm sm:text-base text-slate-400">
                No logs available
              </div>
            ) : (
              <ul className="space-y-2 text-xs sm:text-xs font-mono">
                {logs.map((raw, idx) => (
                  <li
                    key={idx}
                    className="border-b border-slate-700 pb-2 last:border-b-0"
                  >
                    <pre className="whitespace-pre-wrap break-words overflow-x-auto">
                      {raw}
                    </pre>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
