import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "./useWallet";

export const useContract = (address, abi) => {
  const { provider, signer } = useWallet();
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (address && abi && (signer || provider)) {
      const contractInstance = new ethers.Contract(
        address,
        abi,
        signer || provider
      );
      setContract(contractInstance);
    }
  }, [address, abi, provider, signer]);

  return contract;
};

export default useContract;
