import Sidebar from "@/components/SideBar";
import ColorBackground from "@/components/ColorBackground";
import { getAuthUser } from "@/services/auth.service";

const EnterpriseLayout: React.FC<{
  isRestricted: boolean;
  isVerified: boolean;
  children?: React.ReactNode;
}> = ({ isRestricted, isVerified, children }) => {
  if (isRestricted) {
    return (
      <main className="flex justify-center items-center min-h-screen p-20">
        <div className="rounded-2xl border border-red-800 bg-red-500 p-6 text-center text-white">
          <h1 className="text-xl font-semibold">Cuenta restringida</h1>
          <p className="text-sm text-red-100">
            No puedes acceder a este contenido mientras tu cuenta esté
            restringida.
          </p>
        </div>
      </main>
    );
  }
  if (!isVerified) {
    return (
      <main className="flex justify-center items-center min-h-screen p-20">
        <div className="rounded-2xl border border-yellow-800 bg-yellow-500 p-6 text-center text-white">
          <h1 className="text-xl font-semibold">
            Cuenta pendiente de verificación
          </h1>
          <p className="text-sm text-yellow-100">
            Tu cuenta está pendiente de verificación. No podrás acceder a este
            contenido hasta que tu cuenta sea verificada.
          </p>
        </div>
      </main>
    );
  }

  return <main className="ml-0 lg:ml-64 p-4">{children}</main>;
};

export default function MainLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const user = getAuthUser();
  if (!user) return null;
  const isRestrictedEnterprise =
    user.role === "EMPRESA" && Boolean(user.restringida);

  const isVerifiedEnterprise =
    user.role === "EMPRESA" && Boolean(user.verificada);

  console.log({ isRestrictedEnterprise, isVerifiedEnterprise });

  return (
    <ColorBackground>
      <div className="min-h-screen">
        <div className="">
          <Sidebar />
          {user.role === "EMPRESA" ? (
            <EnterpriseLayout
              isRestricted={isRestrictedEnterprise}
              isVerified={isVerifiedEnterprise}
            >
              {children}
            </EnterpriseLayout>
          ) : (
            <main className="ml-0 lg:ml-64 p-4">{children}</main>
          )}
        </div>
      </div>
    </ColorBackground>
  );
}
