import { useState, type JSX } from "react";
import { NavLink } from "react-router";
import { getAuthUser } from "../lib/auth";
import type { Role } from "../types/auth";

interface SidebarLink {
  label: string;
  href: string;
  icon: JSX.Element;
  role: Role[];
}

const links: SidebarLink[] = [
  {
    label: "Dashboard",
    href: "",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM4 16a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm10-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z"
        />
      </svg>
    ),
    role: ["EMPRESA", "ADMIN", "CLIENTE"],
  },
  {
    label: "Festivales",
    href: "festivals",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M3.98 21.5q-.48 0-.772-.38t-.17-.866q.39-1.564.53-3.146t.182-3.204q-1.083-.323-1.666-1.285Q1.5 11.658 1.5 10.5v-.277q0-.402.222-.713q.222-.312.6-.46q2.567-.97 4.81-2.475t4.253-3.367q.14-.13.289-.184T12 2.969t.326.055t.29.184q2.007 1.861 4.251 3.367T21.68 9.05q.377.148.599.46q.222.311.222.713v.277q0 1.158-.584 2.12q-.583.96-1.666 1.284q.044 1.621.183 3.204t.529 3.146q.123.486-.17.866t-.773.38zm-.234-12h16.508q-2.304-1.002-4.355-2.394T12 4.008q-1.848 1.706-3.899 3.098T3.746 9.5M14.5 13q.914 0 1.457-.755T16.5 10.5h-4q0 .99.543 1.745T14.5 13m-5 0q.914 0 1.457-.755T11.5 10.5h-4q0 .99.543 1.745T9.5 13m-5 0q.914 0 1.457-.755T6.5 10.5h-4q0 .99.543 1.745T4.5 13m-.504 7.5h3.771q.264-1.692.399-3.37q.134-1.676.19-3.388q-.442-.183-.79-.522q-.347-.34-.566-.77q-.33.639-.925 1.052t-1.325.48q-.05 1.657-.194 3.284q-.145 1.628-.56 3.234m4.777 0h6.454q-.258-1.625-.39-3.24q-.131-1.616-.187-3.266q-.856.046-1.579-.399T12 12.38q-.348.771-1.071 1.216t-1.579.4q-.056 1.65-.187 3.265q-.132 1.615-.39 3.24m7.46 0h3.77q-.414-1.606-.559-3.234q-.144-1.627-.194-3.283q-.73-.068-1.344-.488T17 12.412q-.2.45-.547.789q-.347.34-.809.541q.056 1.712.193 3.389t.396 3.369M19.5 13q.914 0 1.457-.755T21.5 10.5h-4q0 .99.543 1.745T19.5 13"
        />
      </svg>
    ),
    role: ["EMPRESA", "CLIENTE"],
  },
  {
    label: "Ajustes",
    href: "settings",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M19.9 12.66a1 1 0 0 1 0-1.32l1.28-1.44a1 1 0 0 0 .12-1.17l-2-3.46a1 1 0 0 0-1.07-.48l-1.88.38a1 1 0 0 1-1.15-.66l-.61-1.83a1 1 0 0 0-.95-.68h-4a1 1 0 0 0-1 .68l-.56 1.83a1 1 0 0 1-1.15.66L5 4.79a1 1 0 0 0-1 .48L2 8.73a1 1 0 0 0 .1 1.17l1.27 1.44a1 1 0 0 1 0 1.32L2.1 14.1a1 1 0 0 0-.1 1.17l2 3.46a1 1 0 0 0 1.07.48l1.88-.38a1 1 0 0 1 1.15.66l.61 1.83a1 1 0 0 0 1 .68h4a1 1 0 0 0 .95-.68l.61-1.83a1 1 0 0 1 1.15-.66l1.88.38a1 1 0 0 0 1.07-.48l2-3.46a1 1 0 0 0-.12-1.17ZM18.41 14l.8.9l-1.28 2.22l-1.18-.24a3 3 0 0 0-3.45 2L12.92 20h-2.56L10 18.86a3 3 0 0 0-3.45-2l-1.18.24l-1.3-2.21l.8-.9a3 3 0 0 0 0-4l-.8-.9l1.28-2.2l1.18.24a3 3 0 0 0 3.45-2L10.36 4h2.56l.38 1.14a3 3 0 0 0 3.45 2l1.18-.24l1.28 2.22l-.8.9a3 3 0 0 0 0 3.98m-6.77-6a4 4 0 1 0 4 4a4 4 0 0 0-4-4m0 6a2 2 0 1 1 2-2a2 2 0 0 1-2 2"
        />
      </svg>
    ),
    role: ["EMPRESA", "CLIENTE"],
  },
];

const linkClass =
  (textColor: string) =>
  ({ isActive }: { isActive: boolean }) =>
    [
      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${textColor} transition`,
      isActive
        ? "bg-purple-500 shadow-lg shadow-purple-500/20"
        : "hover:bg-black/10",
    ].join(" ");

const roleBasePath: Record<Role, string> = {
  EMPRESA: "/enterprise",
  ADMIN: "/admin",
  CLIENTE: "/client",
};

const resolveLinkPath = (role: Role, href: string) => {
  if (!href) return roleBasePath[role];
  if (href.startsWith("/")) return href;
  return `${roleBasePath[role]}/${href}`.replace(/\/+/g, "/");
};

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const user = getAuthUser();
  if (!user) return null;

  const doLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (user.role === "EMPRESA") {
      window.location.href = "/enterprise/login";
    }
    if (user.role === "CLIENTE") {
      window.location.href = "/client/login";
    }
    if (user.role === "ADMIN") {
      window.location.href = "/admin/login";
    }
  };

  const colorSchema = {
    EMPRESA: {
      background: "bg-[#EFF6FF]",
      text: "text-black",
    },
    CLIENTE: {
      background: "bg-purple-200/50",
      text: "text-black",
    },
    ADMIN: {
      background: "bg-green-200/35",
      text: "text-black",
    },
  };

  const background = colorSchema[user.role].background;
  const textColor = colorSchema[user.role].text;

  return (
    <div className={`flex h-full flex-col ${textColor} ${background}`}>
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M3.98 21.5q-.48 0-.772-.38t-.17-.866q.39-1.564.53-3.146t.182-3.204q-1.083-.323-1.666-1.285Q1.5 11.658 1.5 10.5v-.277q0-.402.222-.713q.222-.312.6-.46q2.567-.97 4.81-2.475t4.253-3.367q.14-.13.289-.184T12 2.969t.326.055t.29.184q2.007 1.861 4.251 3.367T21.68 9.05q.377.148.599.46q.222.311.222.713v.277q0 1.158-.584 2.12q-.583.96-1.666 1.284q.044 1.621.183 3.204t.529 3.146q.123.486-.17.866t-.773.38zm-.234-12h16.508q-2.304-1.002-4.355-2.394T12 4.008q-1.848 1.706-3.899 3.098T3.746 9.5M14.5 13q.914 0 1.457-.755T16.5 10.5h-4q0 .99.543 1.745T14.5 13m-5 0q.914 0 1.457-.755T11.5 10.5h-4q0 .99.543 1.745T9.5 13m-5 0q.914 0 1.457-.755T6.5 10.5h-4q0 .99.543 1.745T4.5 13m-.504 7.5h3.771q.264-1.692.399-3.37q.134-1.676.19-3.388q-.442-.183-.79-.522q-.347-.34-.566-.77q-.33.639-.925 1.052t-1.325.48q-.05 1.657-.194 3.284q-.145 1.628-.56 3.234m4.777 0h6.454q-.258-1.625-.39-3.24q-.131-1.616-.187-3.266q-.856.046-1.579-.399T12 12.38q-.348.771-1.071 1.216t-1.579.4q-.056 1.65-.187 3.265q-.132 1.615-.39 3.24m7.46 0h3.77q-.414-1.606-.559-3.234q-.144-1.627-.194-3.283q-.73-.068-1.344-.488T17 12.412q-.2.45-.547.789q-.347.34-.809.541q.056 1.712.193 3.389t.396 3.369M19.5 13q.914 0 1.457-.755T21.5 10.5h-4q0 .99.543 1.745T19.5 13"
              />
            </svg>
          </div>

          <h1 className="text-base font-bold text-black">{user.nombre}</h1>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {links
          .filter((link) => link.role.includes(user.role))
          .map((link) => {
            const to = resolveLinkPath(user.role, link.href);

            return (
              <NavLink
                key={link.href}
                to={to}
                end={!link.href}
                className={linkClass(textColor)}
                onClick={onNavigate}
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            );
          })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-black transition hover:bg-red-500/10 hover:text-red-800 cursor-pointer"
          onClick={() => doLogout()}
        >
          <svg
            className="h-5 w-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12H3m0 0 4-4m-4 4 4 4m5-9V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2"
            />
          </svg>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/20 lg:hidden"
        aria-label="Abrir menú"
      >
        <svg
          className="h-5 w-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-white/10 lg:block">
        <SidebarContent />
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={[
          "fixed left-0 top-0 z-50 h-screen w-72 transform border-r border-white/10 transition-transform duration-300 lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="absolute right-4 top-4 z-10">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Cerrar menú"
          >
            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <SidebarContent onNavigate={() => setIsOpen(false)} />
      </aside>
    </>
  );
}
