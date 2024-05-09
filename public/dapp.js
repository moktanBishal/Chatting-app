document.addEventListener('DOMContentLoaded', async () => {
  const web3 = new Web3(window.ethereum);
  const loginButton = document.getElementById('loginButton');
  const metaData = document.getElementById('metaData');
  const newWallet = document.getElementById("newWallet");
  metaData.style.display = 'none';
  newWallet.style.display = 'none';
  let accounts = [];
  
  // Replace with your Capstone contract address
  const contractAddress = '0x38b89654B8107332A4f6AE66D3205009463DA58D';

  // Replace with your Capstone contract ABI
  const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "allOwners",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getOwners",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "isOwner",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const contract = new web3.eth.Contract(contractABI, contractAddress);

  const displayTokenDetails = async () => {
      try {
          const name = await contract.methods.name().call();
          const symbol = await contract.methods.symbol().call();
          const totalSupply = await contract.methods.totalSupply().call();

          document.getElementById('name').textContent = `Name: ${name}`;
          document.getElementById('symbol').textContent = `Symbol: ${symbol}`;
          document.getElementById('totalSupply').textContent = `Total Supply: ${totalSupply}`;
      } catch (error) {
          console.error('Error fetching token details:', error);
      }
  };

  const displayTokenBalances = async () => {
      try {
          const owners = await contract.methods.getOwners().call();
          const tableBody = document.querySelector('#tokenBalances tbody');

          for (const owner of owners) {
              const balance = await contract.methods.balanceOf(owner).call();
              const symbol = await contract.methods.symbol().call();

              const row = tableBody.insertRow();
              const accountAddressCell = row.insertCell(0);
              const tokenBalanceCell = row.insertCell(1);

              accountAddressCell.classList.add('accountAddress');
              accountAddressCell.textContent = owner;

              tokenBalanceCell.classList.add('tokenBalance');
              tokenBalanceCell.textContent = `${balance} ${symbol}`;
          }
      } catch (error) {
          console.error('Error fetching token balances:', error);
      }
  };

  const connectMetaMask = async () => {
    
      try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          // Get the list of accounts
          // Get the connected accounts
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });

          // Check if there's at least one account
          if (accounts.length > 0) {
            // Call the balanceOf function in your ERC-20 token contract
            const balance = await contract.methods.balanceOf(accounts[0]).call();

            // Check if the balance is greater than 0 (indicating the account holds tokens)
            if (parseInt(balance) > 0) {
                metaData.style.display = 'block';
                console.log('The connected account is a token holder.');
                await displayTokenDetails();
                await displayTokenBalances();
                
            } else {
                console.log('The connected account is not a token holder.');
                newWallet.style.display = 'block';
                const tokenHolder = document.createElement('h3');
                tokenHolder.innerHTML = `Please register to view this details and have access to chat feature.`;
                newWallet.appendChild(tokenHolder);
            }
            loginButton.style.display = 'none';
          }
      } catch (error) {
          console.error('Error connecting with MetaMask:', error);
      }
    
  };

  document.getElementById('loginButton').addEventListener('click', connectMetaMask);

  // await displayTokenDetails();
  // await displayTokenBalances();
});