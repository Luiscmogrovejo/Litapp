import "./App.css";
import { useState } from "react";
import { create } from "ipfs-http-client";
import lit from "../lib/lit";
import Header from "./Header";

const projectId = "2DAvyr8w55VO5AtTRypWufXoNv6";   // <---------- your Infura Project ID

const projectSecret = "f5e742b3c7fb93afb6ad4dfbd4032a36";  // <---------- your Infura Secret
// (for security concerns, consider saving these values in .env files)

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

function App() {
  const [file, setFile] = useState(null);
  const [encryptedUrlArr, setEncryptedUrlArr] = useState([]);
  const [encryptedKeyArr, setEncryptedKeyArr] = useState([]);
  const [decryptedFileArr, setDecryptedFileArr] = useState([]);

function retrieveFile(e) {
  // Get the selected file from the event
  const data = e.target.files[0];

  // Set the file state variable with the selected file
  setFile(data);
}

  async function handleSubmit(e) {
    e.preventDefault();

    try {
    console.log("file", file);
    const encrypted = await lit.encryptFile(file);
    console.log("encrypted", encrypted);
    const created = await client.add(encrypted.encryptedFile);
      const created2 = await client.add(encrypted.encryptedSymmetricKey);
      const url = `https://infura-ipfs.io/ipfs/${created.path}`;
      const url2 = `https://infura-ipfs.io/ipfs/${created2.path}`;
      console.log('IPFS URL: ', url);
      console.log("IPFS URL: ", url2);
      console.log('Encrypted String: ', encrypted.encryptedFile);
      console.log("Key String: ", encrypted.encryptedSymmetricKey);

      setEncryptedUrlArr((prev) => [...prev, encrypted.encryptedFile]);
      setEncryptedKeyArr((prev) => [...prev, encrypted.encryptedSymmetricKey]);
    } catch (error) {
      console.log(error.message);
    }
  }

  function decrypt() {
    if (encryptedUrlArr.length !== 0) {
      Promise.all(
        encryptedUrlArr.map((url, idx) => {
          return lit.decryptString(url, encryptedKeyArr[idx]);
        })
      ).then((values) => {
        setDecryptedFileArr(
          values.map((v) => {
            return v.decryptedFile;
          })
        );
      });
    }
  }

  return (
    <div className="App">
      <Header
        title="Here's an example of how to use Lit with IPFS"
      />

      <div className="main">
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={retrieveFile} />
          <button type="submit" className="button">Submit</button>
        </form>
      </div>
      <div>
        <button className="button" onClick={decrypt}>Decrypt</button>
        <div className="display">
          {decryptedFileArr.length !== 0
            ? decryptedFileArr.map((el) => <img src={el} alt="nfts" />) : <h3>Upload data, please! </h3>}
        </div>
      </div>
    </div>
  );
}

export default App;
