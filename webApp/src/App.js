import React from 'react';
import logo from './logo.svg';
import './App.css';
import moment from 'moment-timezone';
import awsmobile from './aws-exports';

var AWS = require('aws-sdk');

var lambda = new AWS.Lambda({region: 'us-east-2', accessKeyId: awsmobile.user_key, secretAccessKey: awsmobile.secred_key});

function DisplayConversationHistory(props) {
  var conversationTree = props.dialogHistory.map(function(dialog) {
    if (dialog.type === "user") {
      var timeClass = "time-right"
      var containerClass = "container user";
    } else if (dialog.type === "watson") {
      var timeClass = "time-left";
      var containerClass = "container watson";
    } else if (dialog.type === "suggestion") {
      var timeClass = "";
      var containerClass = "container suggestion";
    } else {
      var timeClass = "";
      var containerClass = "container exitBox";
    }

    return (
      dialog === null ? null :
      <div class={containerClass}>
        <p>{dialog.text}</p>
        {dialog.time !== null ? <span class={timeClass}>{dialog.time}</span> : null}
      </div>
    );
  });

  return conversationTree;
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogHistory: [],
      userInput: '',
      sessionId: null
    }
    this.handleNewUserInput = this.handleNewUserInput.bind(this);
    this.changeText = this.changeText.bind(this);

    var params = {sessionId: this.state.sessionId};

    const systemResponse = (params) => { 
      return lambda.invoke({
       FunctionName: 'conversationAssistant',
       Payload: JSON.stringify(params)
     }).promise();
   };

   systemResponse(params).then(data => this.handleSystemResponse(data.Payload, this.state.dialogHistory)).catch(err => console.log("Error getting lambda response: ", err));

  }

  changeText(event) {
    this.setState({userInput: event.target.value});
  }

  handleNewUserInput(event) {
    event.preventDefault();

    if (this.state.userInput !== '') {
      var dialogTree = this.state.dialogHistory;
      dialogTree.push({text: "You: " + this.state.userInput, time: moment().format('MMMM Do YYYY, h:mm:ss a'), type: "user"});
      this.setState( {dialogHistory: dialogTree, userInput: ''} );

      console.log(this.state.userInput);
      var params = {userInput: this.state.userInput, sessionId: this.state.sessionId};

      //var endpoint = "https://d0jddvy321.execute-api.us-east-2.amazonaws.com/initialCommunicator/conversationassistantcommunicator";

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

      this.setState( {dialogHistory: dialogTree, userInput: ''} );
      var textbox = document.getElementById('userInput');
      textbox.value = '';
    } else {
      alert("No Text Detected");
    }
  }

  handleSystemResponse(payload, dialogTree) {
    var payloadObject = JSON.parse(payload);
    console.log(payloadObject);
    var watsonResponse = JSON.parse(payloadObject.response);

    var sessionId = payloadObject.sessionId;
    console.log(watsonResponse);
    //console.log(payloadObject.body);
    if (watsonResponse.output.generic.length !== 0) {

      var message = "";
      watsonResponse.output.generic.forEach(element => {
        message += element.text + " ";
      });
      dialogTree.push({text: "Watson: " + message, time: moment().format('MMMM Do YYYY, h:mm:ss a'), type: "watson"});
      

      if (watsonResponse.output.intents.length !== 0) {
        var intent = watsonResponse.output.intents[0].intent;
        var intentMessage = "Watson Detected that your response was ";
        switch (intent) {
          case ("HappyOrExcitement"):
            intentMessage += "HAPPY.";
            break;
          case ("Neutral"):
            intentMessage += "NEUTRAL."
            break;
          case ("Sad"):
            intentMessage += "SAD.";
            break;
          case ("MadOrAngry"):
            intentMessage += "ANGRY.";
            break;
          case ("Dismissive"):
            intentMessage += "DISMISSIVE.";
            break;
          default:
            intentMessage += "Not Recognized."

        }
        dialogTree.push({text: intentMessage, time: null, type: "suggestion"});
      }

      if (typeof watsonResponse.output.debug.branch_exited !== "undefined") {
        dialogTree.push({text: "Conversation Ended.  Send any message to restart conversation.", time: null, type: "exit"});
        sessionId = null;
      }

      this.setState({dialogHistory: dialogTree, sessionId: sessionId});
    } else {
      console.log("No text response from watson");
    }
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
