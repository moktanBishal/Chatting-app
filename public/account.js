document.addEventListener('DOMContentLoaded', async () => {
  const loginButton = document.getElementById('loginButton');
  const newWallet = document.getElementById('newWallet');
  // Establish a websocket connection to the server
  const ws = new WebSocket('ws://192.168.1.64:3000');

  function sendJsonMessage(type, data) {
    ws.send(JSON.stringify({ type, ...data }));
  }

  const connectMetaMask = async () => {
    

    // Function to send a JSON message to the server
    

    loginButton.style.display = 'none';
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (!newWallet.querySelector('h3')) {
      const tokenHolder = document.createElement('h3');
      tokenHolder.innerHTML = `My account address: ${accounts[0]}`;
      newWallet.appendChild(tokenHolder);
    }

    if (!newWallet.querySelector('button')) {
      const register = document.createElement('button');
      register.id = 'registerBtn';
      register.textContent = 'Register';
      newWallet.appendChild(register);
    }

    document.getElementById('registerBtn').addEventListener('click', () => {
      const accountAddress = accounts[0];
      sendJsonMessage('token', { accountAddress });
    });
  }
  loginButton.addEventListener('click', connectMetaMask);
})
