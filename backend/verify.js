import { ethers } from "ethers";

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const message = "Sign this message to login: 29e1d1abfc69e349ee8811bbc759867d";
const signature = await signer.signMessage(message);

console.log(signature);
