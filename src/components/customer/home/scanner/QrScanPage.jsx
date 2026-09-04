import { useNavigate } from "react-router-dom";
import QRScanner from "./QrScanner";
import useTableStore from "../../../../store/tableStore";

const extractTableToken = (scannedValue) => {
  if (!scannedValue) return null;

  const trimmed = scannedValue.trim();

  if (!trimmed.startsWith("http")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const parts = url.pathname.split("/").filter(Boolean);

    return parts[parts.length - 1] || null;
  } catch {
    const parts = trimmed.split("/").filter(Boolean);

    return parts[parts.length - 1] || null;
  }
};

const QRScanPage = () => {
  const navigate = useNavigate();

  const resolveTable = useTableStore(
    (s) => s.resolveTable
  );

  const handleScan = async (scannedValue) => {
    try {
      const token = extractTableToken(scannedValue);

      if (!token) {
        console.error(
          "Could not extract table token from scanned value:",
          scannedValue
        );
        return;
      }

      console.log("Table Token:", token);

      // Resolve the table first.
      // If this fails, confirmation page will NOT be shown.
      const table = await resolveTable(token);

      console.log("Resolved Table:", table);

      if (!table) {
        console.error("Table could not be resolved.");
        return;
      }

      /*
       * IMPORTANT:
       * Do NOT navigate directly to the menu.
       *
       * First show the confirmation page.
       */
      navigate("/customer/scan-confirmation", {
        state: {
          tableToken: token,

          tableNumber:
            table?.table_number ||
            table?.tableNumber ||
            table?.number ||
            null,

          restaurantName:
            table?.seller_name ||
            table?.seller?.name ||
            table?.store_name ||
            table?.restaurant_name ||
            "Your Restaurant",
        },
      });
    } catch (err) {
      console.error("QR Resolve Failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#181A1B] p-4">
      <h1 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Scan Table QR</h1>
      <QRScanner onScan={handleScan} />

      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
        <p className="text-center text-sm text-gray-600">
          Scan the QR code on your table to order online directly from the app.
        </p>
      </div>
    </div>
  );
};

export default QRScanPage;
