import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import Token from './artifacts/contracts/Token.sol/Token.json';
import Contracts from './contracts.json';
import { useState } from 'react';
import { ethers } from 'ethers';

// localhost addresses
// const greeterAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
// const tokenAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

// Ropsten Addresses
// const greeterAddress = "0xAcA3E137b31Dd0A50d3e0895a2245CF88B379679";
// const tokenAddress = "0xD1d16E3a5af52a804363B40eD4EDd784d9bB324f";

function App() {
  const [greeting, setGreetingValue] = useState('');
  const [userAccount, setUserAccount] = useState('');
  const [amount, setAmount] = useState(0);

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      console.log({ provider });
      console.log(Contracts);
      const contract = new ethers.Contract(Contracts["Greeter"].address, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  async function setGreeting() {
    if (!greeting) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Contracts["Greeter"].address, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      setGreetingValue("");
      await transaction.wait();
      fetchGreeting();
    }
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(Contracts["Token"].address, Token.abi, provider);
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Contracts["Token"].address, Token.abi, signer);
      const transaction = await contract.transfer(userAccount, amount);
      transaction.wait();

      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" value={greeting} />

        <br />
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" />
        <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      </header>
    </div>
  );
}

export default App;