import React from 'react';
import logo from './logo.svg';
import './App.css';
import moment from 'moment-timezone';

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
      this.setState( {dialogHistory: dialogTree, userInput: ''} );
      var textbox = document.getElementById('userInput');
      textbox.value = '';
    } else {
      alert("No Text Detected");
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
