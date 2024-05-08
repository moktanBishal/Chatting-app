document.addEventListener('DOMContentLoaded', async () => {
  const web3 = new Web3(window.ethereum);

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
  async function connectToChatApp() {
    // Establish a WebSocket connection to the server
    const ws = new WebSocket('ws://192.168.1.64:3000');

    // Function to send a JSON message to the server
    function sendJsonMessage(type, data) {
        ws.send(JSON.stringify({ type, ...data }));
    }

    // Function to scroll the chat div to the bottom
    function scrollToBottom() {
        const chat = document.getElementById('chat');
        chat.scrollTop = chat.scrollHeight;
    }

    // Event handler for receiving messages from the server
    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);

        if (data.type === 'roomList') {
            // Handle the list of existing rooms
            const select = document.getElementById('roomList');
            select.innerHTML = '';
            data.rooms.forEach(room => {
                const option = document.createElement('option');
                option.value = room;
                option.textContent = room;
                select.appendChild(option);
            });
        } else if (data.type === 'systemMessage') {
            // Handle system messages
            appendMessage(data.message, 'system-message');
        } else if (data.type === 'chatMessage') {
            // Handle chat messages
            const message = `${data.message.nickname}: ${data.message.text}`;
            appendMessage(message);
            scrollToBottom(); // Scroll to bottom when new message is added
        } else if (data.type === 'existingMessages') {
            // Handle existing chat messages
            const chat = document.getElementById('chat');
            chat.innerHTML = '';
            data.messages.forEach(msg => {
                const message = `${msg.nickname}: ${msg.text}`;
                appendMessage(message);
            });
            scrollToBottom(); // Scroll to bottom when existing messages are loaded
        }
    };

    // Function to append a message to the chat
    function appendMessage(message, className = 'message') {
        const chat = document.getElementById('chat');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add(className);
        messageDiv.innerHTML = `<span class="chat-content">${message}</span>`;
        chat.appendChild(messageDiv);
    }

    // Event handler for the "Set Nickname" button
    document.getElementById('setNicknameButton').addEventListener('click', () => {
        const nicknameInput = document.getElementById('nicknameInput');
        const nickname = nicknameInput.value.trim();

        if (nickname !== '') {
            sendJsonMessage('setNickname', { nickname });
            nicknameInput.value = ''; // Clear input field after setting nickname
        }
    });

    // Event handler for the "Create Room" button
    document.getElementById('createRoomButton').addEventListener('click', () => {
        const roomNameInput = document.getElementById('roomNameInput');
        const roomName = roomNameInput.value.trim();

        if (roomName !== '') {
            sendJsonMessage('createRoom', { roomName });
            roomNameInput.value = ''; // Clear input field after creating room
        }
    });

    // Event handler for the "Join Room" button
    document.getElementById('joinRoomButton').addEventListener('click', () => {
        const roomName = document.getElementById('roomList').value.trim();

        if (roomName !== '') {
            sendJsonMessage('joinRoom', { roomName });
        }
    });

    // Event handler for the "Get Rooms" button
    document.getElementById('getRoomsButton').addEventListener('click', () => {
        sendJsonMessage('getRooms', {});
    });

    // Event handler for the "Send Message" button
    document.getElementById('sendMessageButton').addEventListener('click', () => {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        const roomList = document.getElementById('roomList');
        const roomName = roomList.value.trim();
        if (message !== '') {
            sendJsonMessage('chatMessage', { message, roomName });
            messageInput.value = ''; // Clear input field after sending message
        }
    });
  }

  const connectMetaMask = async () => {
    const loginButton = document.getElementById('loginButton');
      try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          // Get the list of accounts
          // Get the connected accounts
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });

          document.getElementById('chatFeature').style.display = 'block';
          document.getElementById('chatRoom').style.display = 'block';

          // Check if there's at least one account
          if (accounts.length > 0) {
            // Call the balanceOf function in your ERC-20 token contract
            const balance = await contract.methods.balanceOf(accounts[0]).call();

            // Check if the balance is greater than 0 (indicating the account holds tokens)
            if (parseInt(balance) > 0) {
                console.log('The connected account is a token holder.');
                await connectToChatApp();
                
                document.getElementById('loginButton').style.display = 'none';         
            } else {
                console.log('The connected account is not a token holder.');
                alert('Connected account is not a token holder.');
            }
          }
      } catch (error) {
          console.error('Error connecting with MetaMask:', error);
      }
    
  };

  document.getElementById('loginButton').addEventListener('click', connectMetaMask);

});