import React from 'react';
import logo from './logo.svg';
import './App.css';
import moment from 'moment-timezone';
import awsmobile from './aws-exports';

var AWS = require('aws-sdk');

function DisplayConversationHistory(props) {
  var conversationTree = props.dialogHistory.map(function(dialog) {
    if (dialog.user) {
      var timeClass = "time-right"
      var containerClass = "container user";
    } else {
      var timeClass = "time-left";
      var containerClass = "container watson";
    }

    return (
      dialog === null ? null :
      <div class={containerClass}>
        <p>{dialog.text}</p>
        <span class={timeClass}>{dialog.time}</span>
      </div>
    );
  });

  return conversationTree;
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogHistory: [{user: false, time: '11:11', text: 'Hello World!'},
      {user: true, time: '11:15', text: 'Sup computer?!'}],
      userInput: ''
    }
    this.handleNewUserInput = this.handleNewUserInput.bind(this);
    this.changeText = this.changeText.bind(this);

  }

  changeText(event) {
    this.setState({userInput: event.target.value});
  }

  handleNewUserInput(event) {
    event.preventDefault();

    if (this.state.userInput !== '') {
      var dialogTree = this.state.dialogHistory;
      dialogTree.push({text: this.state.userInput, time: moment().format('MMMM Do YYYY, h:mm:ss a'), user: true});

      console.log(this.state.userInput);
      var params = {userInput: this.state.userInput};

      //var endpoint = "https://d0jddvy321.execute-api.us-east-2.amazonaws.com/initialCommunicator/conversationassistantcommunicator";

      var lambda = new AWS.Lambda({region: 'us-east-2', accessKeyId: awsmobile.user_key, secretAccessKey: awsmobile.secred_key});

      const systemResponse = (params) => { 
         return lambda.invoke({
          FunctionName: 'conversationAssistant',
          Payload: JSON.stringify(params)
        }).promise();
      };

      systemResponse(params).then(data => this.handleSystemResponse(data.Payload, dialogTree)).catch(err => console.log("Error getting lambda response: ", err));

    // const sendUserInput = {
    //   method: 'POST',
    //   body: JSON.stringify(params),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   mode: 'cors'
    // };

    //   fetch(endpoint, sendUserInput).then(response => console.log("Response from lambda: ", response)).catch(err => console.log("Error sending data to lambda: ", err));

    //   this.setState( {dialogHistory: dialogTree, userInput: ''} );
    //   var textbox = document.getElementById('userInput');
    //   textbox.value = '';
    } else {
      alert("No Text Detected");
    }
  }

  handleSystemResponse(payload, dialogTree) {
    var payloadObject = JSON.parse(payload);
    console.log(payloadObject);
    console.log(payloadObject.body);
    dialogTree.push({text: payloadObject.body, time: moment().format('MMMM Do YYYY, h:mm:ss a'), user: false});
    this.setState({dialogHistory: dialogTree});
  }

  getTextInputForm() {
    return (
      <form onSubmit={this.handleNewUserInput}>
        <div class="form-group">
          <input type="text" class="form-control" id="userInput" placeholder="Enter Text Here" name="input" onChange={this.changeText}/>
        </div>
        <div>
          <input class="btn btn-success" type="submit" value="Send"/>
        </div>
      </form>
    );
  }

  render () {
    return (
      <body>

        <h2>Chat Messages</h2>

        <DisplayConversationHistory dialogHistory={this.state.dialogHistory}/>

        {this.getTextInputForm()}

      </body>
    );
  };
}

export default App;
