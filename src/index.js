import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
//import registerServiceWorker from './registerServiceWorker';


class Chatclass2 extends React.Component {

    constructor(props) {

      super(props);
      this.chatsubmit   = this.chatsubmit.bind(this);
      this.setchatinput = this.setchatinput.bind(this);
      this.chatmessages = this.chatmessages.bind(this);
      this.disconnect   = this.disconnect.bind(this);
      this.pseudoping   = this.pseudoping.bind(this);

      this.state = {
         chatinput: false,
	 messages: []
      }

      this.ws = new WebSocket('ws:172.16.152.138:3000');
    }

    componentDidMount() {

      this.ws.onmessage = function (event) {

        let emess = event.data; 
        if (emess.substring(0,6) === '_PING_') { 

        let pingbacktime = event.data.substring(6);
        console.log ('PBT: ' + pingbacktime);

        let diff = Date.now() - pingbacktime;

        console.log('DIFF: ' + diff + ' s');

        if (diff > 10) {
          console.log('DELAY WARNING');
        }
        }

        else {
        this.setState({
          messages: [...this.state.messages, event.data] 
        })
        }
      }.bind(this);

      this.ws.onclose =  function close() {
        console.log('close detected..');
      };

      this.pseudoping();
    }

    chatsubmit(e) {

      let newmessage = this.state.chatinput	
      this.ws.send(newmessage);
    }


    chatmessages() {

      return this.state.messages.map(function(message, i) {
         return <div>{message}</div> 
      })
    }


    setchatinput(e) {

	this.setState({chatinput: e.target.value})
    }  


    disconnect() {

      console.log('Manual client disconnect..');
      this.ws.close();
    }



    

    pseudoping() {

       setInterval(function pping() {

         //check readystate
         console.log('readyState: ' + this.ws.readyState)
         
         if (this.ws.readyState !==  this.ws.OPEN) {
           return;
         }

         //send 'ping'

         console.log('sending ping...');
         this.ws.send('_PING_' + Date.now());

       }.bind(this), 5000); 

    }

    render(){

        return (
           <div> 
           <div>Chat V2</div>
                      <input type="text" name="chatinput" onChange={this.setchatinput}/>
                      <button onClick={this.chatsubmit}>Send Message</button>
                      <button onClick={this.disconnect}>Disconnect</button>
                      <div>Status:</div> 
	   <div><br />Messages<br />{this.chatmessages()}</div>
           </div> 
        );
    }
}

ReactDOM.render(<Chatclass2 />, document.getElementById('root'));
