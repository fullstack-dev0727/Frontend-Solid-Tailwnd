

export default function webSockectApi() {

  function webSockectConnect() {
    let ws = new WebSocket('ws://127.0.0.1:5000/ws');
    ws.onmessage = (e) => {
        // setResponse([...response(), e.data]);
        console.log("onmessage === ", e.data);
        const resJson = JSON.parse(e.data);
    };
    var timeoutId;
    var intervalId;
    connect();
    function connect() {
        console.log('connect=============');
        ws = new WebSocket('ws://127.0.0.1:5000/ws');
        ws.onopen = () => {
            console.log('Connected to server');
            // If it disconnected, try to reconnect
            // user_id = uuidv4();
            // ws.send(JSON.stringify({
            //     user_id: user_id,
            //     command: 'connect',
            //     data: 'test'
            // }));
            clearTimeout(timeoutId);
        };
        

        ws.onclose = () => {
            console.log('Socket is closed. Reconnect will be attempted in 5 seconds.');
            timeoutId = setTimeout(function () {
                check();
            }, 5000);
        };

        ws.onerror = (error) => {
            console.error("Socket encounted error: ", error, "Closing socket");
            intervalId = setInterval(check, 5000);
            ws.close();
        }
        // clearInterval(intervalId);
    }


    // check if ws is closed , if closed then reconnect
    var check = () => {
        console.log("Checking if socket is closed");
        if (ws.readyState === WebSocket.CLOSED) {
            console.log("Socket is closed. Reconnect will be attempted in 5 second.");
            setTimeout(function () {
                connect();
            }, 5000)
        }        
        // In case of error, clear the interval
        else if (ws.readyState === WebSocket.CLOSING) { 
            console.log("Socket is closing");
            clearInterval(intervalId);
        }
    }
  }

  return {
    webSockectConnect,
  };
}
