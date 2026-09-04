import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

const QRScanner = ({ onScan }) => {
  const [scanned, setScanned] = useState(false);

  const handleScan = (results) => {
    if (scanned) return;

    if (results?.length) {
      const value = results[0].rawValue;

      console.log("Scanned:", value);

      setScanned(true);

      onScan?.(value);
    }
  };

  return (
    <div className="w-full rounded-xl overflow-hidden">
      <Scanner
        onScan={handleScan}
        onError={(err) => console.error(err)}
      />
    </div>
  );
};

export default QRScanner;