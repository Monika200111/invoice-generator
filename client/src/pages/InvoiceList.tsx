import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

interface Invoice {
  _id: string;
  clientName: string;
  grandTotal: number;
  validUntil: string;
}

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    api
      .get("/invoices")
      .then((res) => setInvoices(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load invoices");
      })
      .finally(() => setLoading(false));
  }, []);

  const downloadPDF = async (id: string) => {
    try {
      const response = await api.get(`/invoices/pdf/${id}`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `invoice-${id}.pdf`);

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log("PDF ERROR:", error);
      alert("Failed to download PDF");
    }
  };

  if (loading)
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
          fontSize: "20px",
        }}
      >
        Loading...
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#333",
            }}
          >
            Invoice Dashboard
          </h1>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            style={{
              padding: "10px 18px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: "#dc3545",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </div>

        {/* New Invoice Button */}
        <Link to="/create-invoice">
          <button
            style={{
              padding: "10px 18px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: "#0d6efd",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            + New Invoice
          </button>
        </Link>

        {invoices.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              marginTop: "30px",
            }}
          >
            No invoices yet. Create one!
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f8f9fa",
                }}
              >
                <th
                  style={{
                    padding: "14px",
                    textAlign: "left",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Client
                </th>

                <th
                  style={{
                    padding: "14px",
                    textAlign: "left",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Grand Total
                </th>

                <th
                  style={{
                    padding: "14px",
                    textAlign: "left",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Valid Until
                </th>

                <th
                  style={{
                    padding: "14px",
                    textAlign: "left",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id}>
                  <td
                    style={{
                      padding: "14px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {inv.clientName}
                  </td>

                  <td
                    style={{
                      padding: "14px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {formatINR(inv.grandTotal)}
                  </td>

                  <td
                    style={{
                      padding: "14px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {new Date(inv.validUntil).toLocaleDateString("en-IN")}
                  </td>

                  <td
                    style={{
                      padding: "14px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <button
                      onClick={() => downloadPDF(inv._id)}
                      style={{
                        padding: "8px 14px",
                        border: "none",
                        borderRadius: "6px",
                        backgroundColor: "#198754",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}