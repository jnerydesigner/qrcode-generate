import { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { PiDownloadSimpleFill } from "react-icons/pi";

function App() {
  const [text, setText] = useState<string>();
  const [image, setImage] = useState<string>();

  const handleGenerateQrCode = async () => {
    const response = await axios.post("http://191.101.78.119:4545/qrcode", {
      text,
    });
    console.log(response);

    setImage(response.data.image);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-50 flex justify-center items-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full text-center">
        <h1>🇧🇷 Gerador de QrCode</h1>
        <input
          type="text"
          className="border border-gray-300 rounded-lg p-3 w-full 
          focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-400 font-bold"
          placeholder="Digite sua Url"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleGenerateQrCode}
          className="mt-4 w-full bg-gray-400 rounded-md p-2 cursor-pointer text-white font-bold hover:bg-gray-500 transition duration-300"
        >
          Gerar QrCode
        </button>

        {image && (
          <div className="m-6 flex justify-center items-center flex-col">
            <p className="mb-4">✅ QrCode Gerado com Sucesso</p>
            <img
              src={image}
              alt={text}
              className="h-46 w-46 border rounded-lg shadow mb-4"
            />
            <a
              href={image}
              download={`${uuidv4()}.png`}
              className="mt-4 w-full bg-gray-400 rounded-md p-2 cursor-pointer text-white font-bold hover:bg-gray-500 transition duration-300 flex justify-center items-center gap-6"
            >
              <PiDownloadSimpleFill className="w-[30px] h-[30px]" />{" "}
              <h3>Baixar QRCode</h3>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
