import React from 'react';
import logo from './logo.svg';
import './App.css';
import moment from 'moment-timezone';
import awsmobile from './aws-exports';
import {getTestOpeningText} from './bob.js';

// TODO user emotionList as the dictionary variable name for score

var AWS = require('aws-sdk');

var lambda = new AWS.Lambda({region: 'us-east-2', accessKeyId: awsmobile.user_key, secretAccessKey: awsmobile.secret_key});
//var lambda = null;

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
      userInputHistory: [],
      sessionId: null
    }
    this.handleNewUserInput = this.handleNewUserInput.bind(this);
    this.changeText = this.changeText.bind(this);

  // var endpoint = "https://d0jddvy321.execute-api.us-east-2.amazonaws.com/initialCommunicator/returnTest";
  // fetch(endpoint, params).then(response => console.log(response)).catch(err => console.log("Error sending data to lambda: ", err));

  }

  componentDidMount() {
    if (!this.props.test) {
      var params = {sessionId: this.state.sessionId};
      const systemResponse = (params) => { 
        return lambda.invoke({
          FunctionName: 'conversationAssistant',
          Payload: JSON.stringify(params)
        }).promise();
      };
      
    //console.log(testOpeningText);
      systemResponse(params).then(data => this.handleSystemResponse(data.Payload, this.state.dialogHistory)).catch(err => console.log("Error getting lambda response: ", err));
    } else {
      // This happens when running in test mode
      var testOpeningText = getTestOpeningText;
      var history = this.state.dialogHistory.slice();
      history.push(testOpeningText);
      this.setState({sessionId: 1234, dialogHistory: history});

    }
  }

  changeText(event) {
    this.setState({userInput: event.target.value});
  }

  handleNewUserInput(event) {
    console.log("Event: ", event);
    event.preventDefault();

    if (this.state.userInput !== '') {
      var dialogTree = this.state.dialogHistory;
      dialogTree.push({text: "You: " + this.state.userInput, time: moment().format('MMMM Do YYYY, h:mm:ss a'), type: "user"});
      var userInputTree = this.state.userInputHistory.slice();
      userInputTree.push(this.state.userInput);
      this.setState( {dialogHistory: dialogTree, userInput: '', userInputHistory: userInputTree} );

      console.log(this.state.userInput);
      var params = {userInput: this.state.userInput, sessionId: this.state.sessionId};

      // var endpoint = "https://d0jddvy321.execute-api.us-east-2.amazonaws.com/initialCommunicator/returnTest";

      if (!this.props.test) {
        const systemResponse = (params) => { 
          return lambda.invoke({
            FunctionName: 'conversationAssistant',
            Payload: JSON.stringify(params)
          }).promise();
        };
        
        systemResponse(params).then(data => this.handleSystemResponse(data.Payload, dialogTree)).catch(err => console.log("Error getting lambda response: ", err));
      }


    // const sendUserInput = {
    //   method: 'POST',
    //   body: JSON.stringify(params),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   mode: 'cors'
    // };

    //   fetch(endpoint, sendUserInput).then(response => this.handleSystemResponse(response.Payload, dialogTree)).catch(err => console.log("Error sending data to lambda: ", err));

      // this.setState( {dialogHistory: dialogTree, userInput: ''} );
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
      //var testOpeningText = getTestOpeningText;
      //dialogTree.push(testOpeningText);
      

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

  goBack() {
    // TODO send id to lambda function to go back a node in the conversation tree
    // Send the session id and a buffer of all text that has been sent from the user already, then
    // delete the last input the user sent to watson.
    console.log("Session ID: " + this.state.sessionId + " is going back in the conversation tree");

    var userHistory = this.state.userInputHistory.slice();
    var totalHistory = this.state.dialogHistory.slice();
    userHistory.pop();
    totalHistory.pop();
    totalHistory.pop();
    totalHistory.pop();

    console.log('history list: ', userHistory);
    console.log('sessionId:', this.state.sessionId);

    var params = {sessionId: this.state.sessionId, history: userHistory};

    this.setState({userInputHistory: userHistory, dialogHistory: totalHistory, sessionId: null});

    if (!this.props.test) {
      const systemResponse = (params) => { 
        return lambda.invoke({
          FunctionName: 'GoBack',
          Payload: JSON.stringify(params)
        }).promise();
      };
      
      systemResponse(params).then(data => this.goBackResponse(data.Payload)).catch(err => console.log("Error getting lambda response: ", err));
    }
  }

  goBackResponse(payload) {
    var payloadObject = JSON.parse(payload);
    console.log(payloadObject);

    var sessionId = payloadObject.sessionId;
    this.setState({sessionId: sessionId});
  }

  checkUserInput() {
    // TODO send user input text to lambda function for intent analysis
    console.log("Checking intent of user input: " + this.state.userInput);
  }

  // Check Text: pass string text inside the textbox
  // Go Back: pass the session id
  // Restart conversation loop: pass the session id
  getTextInputForm() {
    return (
      <form onSubmit={this.handleNewUserInput}>
        <div class="form-group">
          <input type="text" class="form-control" id="userInput" placeholder="Enter Text Here" name="input" onChange={this.changeText}/>
        </div>
        <div>
          <input class="btn btn-success" type="submit" value="Send" id="send"/>
          <input class="btn btn-primary" type="button" value="Check Text" id="check" onClick={() => this.checkUserInput()}/>
          <input class="btn btn-warning" type="button" value="Go Back" id="back" onClick={() => this.goBack()}/>
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