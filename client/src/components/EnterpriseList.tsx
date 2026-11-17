import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";

interface Enterprise {
  id: string;
  cif: string;
  persona: string;
  correo: string;
  telefono: string;
  razon_social: string;
  domicilio: string;
  verificada: boolean;
  restringida: boolean;
}

function StatusBadge({
  verificada,
  restringida,
}: {
  verificada: boolean;
  restringida: boolean;
}) {
  if (restringida) {
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-800 bg-red-400/50 rounded-full">
        <span className="hidden md:inline-flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 10a2 2 0 0 0-2 2a2 2 0 0 0 2 2c1.11 0 2-.89 2-2a2 2 0 0 0-2-2"
            />
          </svg>
        </span>{" "}
        Restringida
      </span>
    );
  }
  if (verificada) {
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-400/50 rounded-full">
        <span className="hidden md:inline-flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 10a2 2 0 0 0-2 2a2 2 0 0 0 2 2c1.11 0 2-.89 2-2a2 2 0 0 0-2-2"
            />
          </svg>
        </span>{" "}
        Verificada
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-400/50 rounded-full">
      <span className="hidden md:inline-flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 10a2 2 0 0 0-2 2a2 2 0 0 0 2 2c1.11 0 2-.89 2-2a2 2 0 0 0-2-2"
          />
        </svg>
      </span>{" "}
      Pendiente
    </span>
  );
}

function AccionsSwitch({
  verificada,
  restringida,
  id,
}: {
  verificada: boolean;
  restringida: boolean;
  id: string;
}) {
  const verifyEnterprise = async () => {
    if (!id) {
      return;
    }

    await api.post("/enterprise/verify", {
      id,
      status: !verificada,
    });
    window.location.reload();
  };
  const restrictEnterprise = async () => {
    if (!id) {
      return;
    }
    await api.post("/enterprise/restrict", {
      id,
      status: !restringida,
    });

    window.location.reload();
  };

  return (
    <div className="px-3 py-1 flex gap-2 justify-center items-center">
      <button onClick={verifyEnterprise}>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`w-5 h-5 hover:text-black ${verificada ? "text-green-500" : "text-[#94A3B8] cursor-pointer"}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.01667 8.51667L9.12917 4.40417L8.3125 3.5875L5.01667 6.88333L3.35417 5.22083L2.5375 6.0375L5.01667 8.51667ZM5.83333 11.6667C5.02639 11.6667 4.26806 11.5135 3.55833 11.2073C2.84861 10.901 2.23125 10.4854 1.70625 9.96042C1.18125 9.43542 0.765625 8.81806 0.459375 8.10833C0.153125 7.39861 0 6.64028 0 5.83333C0 5.02639 0.153125 4.26806 0.459375 3.55833C0.765625 2.84861 1.18125 2.23125 1.70625 1.70625C2.23125 1.18125 2.84861 0.765625 3.55833 0.459375C4.26806 0.153125 5.02639 0 5.83333 0C6.64028 0 7.39861 0.153125 8.10833 0.459375C8.81806 0.765625 9.43542 1.18125 9.96042 1.70625C10.4854 2.23125 10.901 2.84861 11.2073 3.55833C11.5135 4.26806 11.6667 5.02639 11.6667 5.83333C11.6667 6.64028 11.5135 7.39861 11.2073 8.10833C10.901 8.81806 10.4854 9.43542 9.96042 9.96042C9.43542 10.4854 8.81806 10.901 8.10833 11.2073C7.39861 11.5135 6.64028 11.6667 5.83333 11.6667ZM5.83333 10.5C7.13611 10.5 8.23958 10.0479 9.14375 9.14375C10.0479 8.23958 10.5 7.13611 10.5 5.83333C10.5 4.53056 10.0479 3.42708 9.14375 2.52292C8.23958 1.61875 7.13611 1.16667 5.83333 1.16667C4.53056 1.16667 3.42708 1.61875 2.52292 2.52292C1.61875 3.42708 1.16667 4.53056 1.16667 5.83333C1.16667 7.13611 1.61875 8.23958 2.52292 9.14375C3.42708 10.0479 4.53056 10.5 5.83333 10.5Z"
            fill="currentColor"
          />
        </svg>
      </button>
      {restringida ? (
        <button onClick={restrictEnterprise}>
          <svg
            width="10"
            height="13"
            viewBox="0 0 10 13"
            fill="none"
            className="w-5 h-5 text-[#BA1A1A] cursor-pointer hover:text-black"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.16667 4.08333H6.41667V2.91667C6.41667 2.43056 6.24653 2.01736 5.90625 1.67708C5.56597 1.33681 5.15278 1.16667 4.66667 1.16667C4.18056 1.16667 3.76736 1.33681 3.42708 1.67708C3.08681 2.01736 2.91667 2.43056 2.91667 2.91667H1.75C1.75 2.10972 2.03438 1.42188 2.60313 0.853125C3.17188 0.284375 3.85972 0 4.66667 0C5.47361 0 6.16146 0.284375 6.73021 0.853125C7.29896 1.42188 7.58333 2.10972 7.58333 2.91667V4.08333H8.16667C8.4875 4.08333 8.76215 4.19757 8.99063 4.42604C9.2191 4.65451 9.33333 4.92917 9.33333 5.25V11.0833C9.33333 11.4042 9.2191 11.6788 8.99063 11.9073C8.76215 12.1358 8.4875 12.25 8.16667 12.25H1.16667C0.845833 12.25 0.571181 12.1358 0.342708 11.9073C0.114236 11.6788 0 11.4042 0 11.0833V5.25C0 4.92917 0.114236 4.65451 0.342708 4.42604C0.571181 4.19757 0.845833 4.08333 1.16667 4.08333ZM1.16667 11.0833H8.16667V5.25H1.16667V11.0833ZM4.66667 9.33333C4.9875 9.33333 5.26215 9.2191 5.49062 8.99063C5.7191 8.76215 5.83333 8.4875 5.83333 8.16667C5.83333 7.84583 5.7191 7.57118 5.49062 7.34271C5.26215 7.11424 4.9875 7 4.66667 7C4.34583 7 4.07118 7.11424 3.84271 7.34271C3.61424 7.57118 3.5 7.84583 3.5 8.16667C3.5 8.4875 3.61424 8.76215 3.84271 8.99063C4.07118 9.2191 4.34583 9.33333 4.66667 9.33333ZM1.16667 11.0833V5.25V11.0833Z"
              fill="currentColor"
            />
          </svg>
        </button>
      ) : (
        <button onClick={restrictEnterprise}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`w-5 h-5 hover:text-black ${restringida ? "text-green-500" : "text-[#94A3B8] cursor-pointer"}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.83333 11.6667C5.02639 11.6667 4.26806 11.5135 3.55833 11.2073C2.84861 10.901 2.23125 10.4854 1.70625 9.96042C1.18125 9.43542 0.765625 8.81806 0.459375 8.10833C0.153125 7.39861 0 6.64028 0 5.83333C0 5.02639 0.153125 4.26806 0.459375 3.55833C0.765625 2.84861 1.18125 2.23125 1.70625 1.70625C2.23125 1.18125 2.84861 0.765625 3.55833 0.459375C4.26806 0.153125 5.02639 0 5.83333 0C6.64028 0 7.39861 0.153125 8.10833 0.459375C8.81806 0.765625 9.43542 1.18125 9.96042 1.70625C10.4854 2.23125 10.901 2.84861 11.2073 3.55833C11.5135 4.26806 11.6667 5.02639 11.6667 5.83333C11.6667 6.64028 11.5135 7.39861 11.2073 8.10833C10.901 8.81806 10.4854 9.43542 9.96042 9.96042C9.43542 10.4854 8.81806 10.901 8.10833 11.2073C7.39861 11.5135 6.64028 11.6667 5.83333 11.6667ZM5.83333 10.5C6.35833 10.5 6.86389 10.4149 7.35 10.2448C7.83611 10.0747 8.28333 9.82917 8.69167 9.50833L2.15833 2.975C1.8375 3.38333 1.59201 3.83056 1.42188 4.31667C1.25174 4.80278 1.16667 5.30833 1.16667 5.83333C1.16667 7.13611 1.61875 8.23958 2.52292 9.14375C3.42708 10.0479 4.53056 10.5 5.83333 10.5ZM9.50833 8.69167C9.82917 8.28333 10.0747 7.83611 10.2448 7.35C10.4149 6.86389 10.5 6.35833 10.5 5.83333C10.5 4.53056 10.0479 3.42708 9.14375 2.52292C8.23958 1.61875 7.13611 1.16667 5.83333 1.16667C5.30833 1.16667 4.80278 1.25174 4.31667 1.42188C3.83056 1.59201 3.38333 1.8375 2.975 2.15833L9.50833 8.69167Z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function EnterpriseList() {
  const [enterprises, setEnterprises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredEnterprises = useMemo(() => {
    return enterprises.filter((enterprise: Enterprise) => {
      return (
        enterprise.cif.toLowerCase().includes(searchTerm) ||
        enterprise.razon_social.toLowerCase().includes(searchTerm) ||
        enterprise.correo.toLowerCase().includes(searchTerm)
      );
    });
  }, [searchTerm, enterprises]);

  useEffect(() => {
    const fetchEnterprises = async () => {
      const response = await api.get("/enterprise");
      const data = response.data;
      setEnterprises(data.data);
    };

    fetchEnterprises();
  }, []);

  const handleInputSearch = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value.toLowerCase();
    setSearchTerm(value);
  };

  return (
    <div className="w-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Lista de Empresas</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por CIF, razón social o correo"
          className="w-full p-2 border border-gray-300 rounded"
          onInput={handleInputSearch}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse border border-gray-300">
          <colgroup>
            <col className="w-[35%]" />
            <col className="w-[12%] hidden md:table-column" />
            <col className="w-[30%] hidden md:table-column" />
            <col className="w-[13%]" />
            <col className="w-[10%]" />
          </colgroup>
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Empresa Gestora</th>
              <th className="py-2 px-4 border-b hidden md:table-cell text-left">
                CIF
              </th>
              <th className="py-2 px-4 border-b hidden md:table-cell text-left">
                Contacto
              </th>
              <th className="py-2 px-4 border-b text-left">Estado</th>
              <th className="py-2 px-4 border-b text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnterprises.map((enterprise: Enterprise) => (
              <tr
                key={enterprise.id}
                className="hover:bg-gray-100 cursor-crosshair"
              >
                <td className="py-2 px-4 border-b">
                  <div className="flex flex-row items-center justify-left">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      className="w-5 h-5 shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 18V4H4V0H14V8H18V18H10V14H8V18H0ZM2 16H4V14H2V16ZM2 12H4V10H2V12ZM2 8H4V6H2V8ZM6 12H8V10H6V12ZM6 8H8V6H6V8ZM6 4H8V2H6V4ZM10 12H12V10H10V12ZM10 8H12V6H10V8ZM10 4H12V2H10V4ZM14 16H16V14H14V16ZM14 12H16V10H14V12Z"
                        fill="#CBD5E1"
                      />
                    </svg>
                    <div className="flex flex-col min-w-0 ml-2">
                      <div className="truncate">{enterprise.razon_social}</div>
                      <div className="text-gray-400 truncate">
                        CIF: {enterprise.cif}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-2 px-4 border-b hidden md:table-cell truncate">
                  {enterprise.cif}
                </td>
                <td className="py-2 px-4 border-b hidden md:table-cell">
                  <div className="truncate">{enterprise.correo}</div>
                  <div className="truncate">{enterprise.telefono}</div>
                </td>
                <td className="py-2 px-4 border-b">
                  <StatusBadge
                    verificada={enterprise.verificada}
                    restringida={enterprise.restringida}
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <AccionsSwitch
                    verificada={enterprise.verificada}
                    restringida={enterprise.restringida}
                    id={enterprise.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
