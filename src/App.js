import React, { useState, useEffect } from "react";
import GaugeChart from "react-gauge-chart";
import "tailwindcss/tailwind.css";

function App() {
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fakeSpeed, setFakeSpeed] = useState(0);

  const simulateSpeed = (setSpeedCallback, finalSpeed) => {
    let currentSpeed = 0;
    const interval = setInterval(() => {
      currentSpeed = Math.min(currentSpeed + Math.random() * 20, 100); // Rastgele hızlanma
      setFakeSpeed(currentSpeed / 100); // Gauge için normalize değer
      if (currentSpeed >= finalSpeed) {
        clearInterval(interval);
        setFakeSpeed(finalSpeed / 100); // Gerçek değere sabitle
        setSpeedCallback(finalSpeed);
      }
    }, 100); // Her 100ms'de hız güncellenir
  };

  const testDownloadSpeed = async () => {
    setLoading(true);
    const startTime = new Date().getTime();
    const fileSizeInBytes = 5 * 1024 * 1024; // 5 MB
    const testFileUrl = "https://upload.wikimedia.org/wikipedia/commons/3/3f/JPEG_example_flower.jpg";

    simulateSpeed(setDownloadSpeed, 75); // Rastgele animasyon için 75 Mbps hedef
    try {
      const response = await fetch(testFileUrl);
      await response.blob();
      const endTime = new Date().getTime();
      const durationInSeconds = (endTime - startTime) / 1000;
      const speedMbps = ((fileSizeInBytes * 8) / durationInSeconds) / 1_000_000;

      setDownloadSpeed(speedMbps);
      setFakeSpeed(speedMbps / 100);
    } catch (error) {
      console.error("Download test failed:", error);
    }
    setLoading(false);
  };

  const testUploadSpeed = async () => {
    setLoading(true);
    const startTime = new Date().getTime();
    const data = new Uint8Array(5 * 1024 * 1024); // 5 MB dummy data

    simulateSpeed(setUploadSpeed, 50); // Rastgele animasyon için 50 Mbps hedef
    try {
      await fetch("https://httpbin.org/post", {
        method: "POST",
        body: data,
      });
      const endTime = new Date().getTime();
      const durationInSeconds = (endTime - startTime) / 1000;
      const speedMbps = ((data.length * 8) / durationInSeconds) / 1_000_000;

      setUploadSpeed(speedMbps);
      setFakeSpeed(speedMbps / 100);
    } catch (error) {
      console.error("Upload test failed:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center space-y-6">
      <h1 className="text-4xl font-bold mb-6">Speedtest Uygulaması</h1>
      <div className="flex space-x-6">
        <button
          onClick={testDownloadSpeed}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "İndirme Testi Yapılıyor..." : "İndirme Hızını Test Et"}
        </button>
        <button
          onClick={testUploadSpeed}
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition"
          disabled={loading}
        >
          {loading ? "Yükleme Testi Yapılıyor..." : "Yükleme Hızını Test Et"}
        </button>
      </div>
      <div className="flex flex-col items-center space-y-6 w-full max-w-lg">
        <div className="w-full text-center">
          <h2 className="text-xl font-bold text-blue-600 mb-2">İndirme Hızı</h2>
          <GaugeChart
            id="download-speed-gauge"
            percent={fakeSpeed} // Rastgele veya gerçek hız
            textColor="#000"
            colors={["#FF5F6D", "#FFC371", "#7FFF00"]}
            nrOfLevels={20}
            arcWidth={0.3}
            needleColor="#345243"
            formatTextValue={(value) => `${Math.round(downloadSpeed)} Mbps`}
          />
        </div>
        <div className="w-full text-center">
          <h2 className="text-xl font-bold text-green-600 mb-2">Yükleme Hızı</h2>
          <GaugeChart
            id="upload-speed-gauge"
            percent={fakeSpeed} // Rastgele veya gerçek hız
            textColor="#000"
            colors={["#FF5F6D", "#FFC371", "#7FFF00"]}
            nrOfLevels={20}
            arcWidth={0.3}
            needleColor="#345243"
            formatTextValue={(value) => `${Math.round(uploadSpeed)} Mbps`}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
