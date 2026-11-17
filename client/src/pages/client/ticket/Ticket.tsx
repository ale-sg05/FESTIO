import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import TicketComponent from "../../../components/TicketComponent";
import MainLayout from "@/layouts/Layout";
import { api } from "@/lib/api";
import { getAuthUser } from "@/lib/auth";
export default function EventTicket() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [ticketData, setTicketData] = useState<any | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const user = getAuthUser();
  useEffect(() => {
    if (!user) {
      navigate("/unauthorized");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        if (!id) return;
        const response = await api.get(`/client/ticket/${id}`);
        setTicketData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching ticket:", error);
        const apiError = (error as any)?.response?.data?.error;
        const message = apiError ?? (error as Error).message ?? String(error);
        if (message === "Ticket not found or does not belong to the client") {
          navigate("/404");
          return;
        }
        setError(message);
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  return (
    <MainLayout>
      {loading && <p>Cargando ticket...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && ticketData && (
        <TicketComponent ticket={ticketData} user={user} />
      )}
    </MainLayout>
  );
}
