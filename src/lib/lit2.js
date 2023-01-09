const Lit = require("./lit.js");

const file = "/files/211220 SC NFT Ep2.5 FINAL.mov";
  Lit.encryptFile(file).then((result) => {
    console.log(result)
  });
