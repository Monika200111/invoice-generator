import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

interface Item {
name: string;
qty: number;
rate: number;
}

export default function CreateInvoice() {
const navigate = useNavigate();

const [clientName, setClientName] = useState("");
const [validUntil, setValidUntil] = useState("");
const [items, setItems] = useState<Item[]>([
{ name: "", qty: 1, rate: 0 },
]);

const addItem = () => {
setItems([...items, { name: "", qty: 1, rate: 0 }]);
};

const updateItem = (
index: number,
field: string,
value: string | number
) => {
const newItems = [...items];
newItems[index] = { ...newItems[index], [field]: value };
setItems(newItems);
};

const removeItem = (index: number) => {
setItems(items.filter((_, i) => i !== index));
};

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();

let formattedDate = validUntil;

if (validUntil && validUntil.includes("-")) {
  const parts = validUntil.split("-");

  if (parts[0].length === 2) {
    formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
}

const total = items.reduce(
  (sum, item) => sum + Number(item.qty) * Number(item.rate),
  0
);

const gst = 18;
const gstAmount = total * 0.18;
const grandTotal = total + gstAmount;

const backendItems = items.map((item) => ({
  name: item.name,
  qty: Number(item.qty),
  rate: Number(item.rate),
}));

try {
  await api.post("/invoices", {
    clientName,
    items: backendItems,
    validUntil: formattedDate,
    gst,
    gstAmount,
    total,
    grandTotal,
  });

  alert("Invoice created successfully");
  navigate("/");
} catch (err: any) {
  console.log(err);
  alert(
    "Error creating invoice: " +
      (err.response?.data?.error || err.message)
  );
}

};

const subtotal = items.reduce(
(sum, item) => sum + item.qty * item.rate,
0
);

const gstAmount = subtotal * 0.18;
const grandTotal = subtotal + gstAmount;

const formatINR = (amount: number) => {
return new Intl.NumberFormat("en-IN", {
style: "currency",
currency: "INR",
maximumFractionDigits: 0,
}).format(amount);
};

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
<h1
style={{
marginBottom: "30px",
color: "#333",
}}
></h1>
Create Invoice



    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Client Name
          </label>

          <input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Valid Until
          </label>

          <input
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          />
        </div>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#f8f9fa",
            }}
          >
            <th style={{ padding: "14px", textAlign: "left" }}>
              Product
            </th>

            <th style={{ padding: "14px", textAlign: "left" }}>
              Qty
            </th>

            <th style={{ padding: "14px", textAlign: "left" }}>
              Rate
            </th>

            <th style={{ padding: "14px", textAlign: "left" }}>
              Total
            </th>

            <th style={{ padding: "14px" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: "12px" }}>
                <input
                  placeholder="Product Name"
                  value={item.name}
                  onChange={(e) =>
                    updateItem(index, "name", e.target.value)
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                  }}
                />
              </td>

              <td style={{ padding: "12px" }}>
                <input
                  type="number"
                  value={item.qty}
                  min="1"
                  required
                  onChange={(e) =>
                    updateItem(index, "qty", Number(e.target.value))
                  }
                  style={{
                    width: "80px",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                  }}
                />
              </td>

              <td style={{ padding: "12px" }}>
                <input
                  type="number"
                  value={item.rate}
                  min="0"
                  required
                  onChange={(e) =>
                    updateItem(index, "rate", Number(e.target.value))
                  }
                  style={{
                    width: "120px",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                  }}
                />
              </td>

              <td style={{ padding: "12px" }}>
                {formatINR(item.qty * item.rate)}
              </td>

              <td style={{ padding: "12px" }}>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        type="button"
        onClick={addItem}
        style={{
          backgroundColor: "#0d6efd",
          color: "#fff",
          border: "none",
          padding: "10px 18px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        + Add Item
      </button>

      <div
        style={{
          marginTop: "40px",
          textAlign: "right",
          fontSize: "18px",
        }}
      >
        <p>Total: {formatINR(subtotal)}</p>
        <p>GST (18%): {formatINR(gstAmount)}</p>

        <h2
          style={{
            borderTop: "2px solid #ddd",
            paddingTop: "10px",
          }}
        >
          Grand Total: {formatINR(grandTotal)}
        </h2>
      </div>

      <button
        type="submit"
        style={{
          marginTop: "20px",
          backgroundColor: "#198754",
          color: "#fff",
          border: "none",
          padding: "12px 24px",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        Create Invoice
      </button>
    </form>
  </div>
</div>

);
}