(window.webpackJsonpconversationwebapp=window.webpackJsonpconversationwebapp||[]).push([[0],{17:function(e,t){},432:function(e,t,n){"use strict";n.r(t);var a=n(3),s=n.n(a),o=n(43),r=n.n(o),i=(n(54),n(44)),u=n(45),c=n(47),l=n(46),p=n(8),d=n(48),m=(n(55),n(56),n(18)),h=n.n(m),g={aws_project_region:"us-east-2",aws_content_delivery_bucket:"conversation-app-webapp",aws_content_delivery_bucket_region:"us-east-2",aws_content_delivery_url:"http://conversation-app-webapp.s3-website.us-east-2.amazonaws.com",aws_cognito_identity_pool_id:"us-east-2:e1cdfc50-7f9b-40b1-9428-6ca779a3abb2",aws_cognito_region:"us-east-2",aws_user_pools_id:"us-east-2_NByiRHYWX",aws_user_pools_web_client_id:"3phjbiju46tst03l7lbtsd7rfl",oauth:{},user_key:"AKIAQKF4G54JFAEI6KGK",secred_key:"yrTo4INaGeP+c+9BU9LVTspn6sn3W7+rMz4yKQGt"},y=n(59);function b(e){return e.dialogHistory.map((function(e){if(e.user)var t="time-right",n="container user";else t="time-left",n="container watson";return null===e?null:s.a.createElement("div",{class:n},s.a.createElement("p",null,e.text),s.a.createElement("span",{class:t},e.time))}))}var f=function(e){function t(e){var n;return Object(i.a)(this,t),(n=Object(c.a)(this,Object(l.a)(t).call(this,e))).state={dialogHistory:[{user:!1,time:"11:11",text:"Hello World!"},{user:!0,time:"11:15",text:"Sup computer?!"}],userInput:""},n.handleNewUserInput=n.handleNewUserInput.bind(Object(p.a)(n)),n.changeText=n.changeText.bind(Object(p.a)(n)),n}return Object(d.a)(t,e),Object(u.a)(t,[{key:"changeText",value:function(e){this.setState({userInput:e.target.value})}},{key:"handleNewUserInput",value:function(e){var t=this;if(e.preventDefault(),""!==this.state.userInput){var n=this.state.dialogHistory;n.push({text:this.state.userInput,time:h()().format("MMMM Do YYYY, h:mm:ss a"),user:!0}),console.log(this.state.userInput);var a={userInput:this.state.userInput},s=new y.Lambda({region:"us-east-2",accessKeyId:g.user_key,secretAccessKey:g.secred_key});(function(e){return s.invoke({FunctionName:"conversationAssistant",Payload:JSON.stringify(e)}).promise()})(a).then((function(e){return t.handleSystemResponse(e.Payload,n)})).catch((function(e){return console.log("Error getting lambda response: ",e)}))}else alert("No Text Detected")}},{key:"handleSystemResponse",value:function(e,t){var n=JSON.parse(e);console.log(n),console.log(n.body),t.push({text:n.body,time:h()().format("MMMM Do YYYY, h:mm:ss a"),user:!1}),this.setState({dialogHistory:t})}},{key:"getTextInputForm",value:function(){return s.a.createElement("form",{onSubmit:this.handleNewUserInput},s.a.createElement("div",{class:"form-group"},s.a.createElement("input",{type:"text",class:"form-control",id:"userInput",placeholder:"Enter Text Here",name:"input",onChange:this.changeText})),s.a.createElement("div",null,s.a.createElement("input",{class:"btn btn-success",type:"submit",value:"Send"})))}},{key:"render",value:function(){return s.a.createElement("body",null,s.a.createElement("h2",null,"Chat Messages"),s.a.createElement(b,{dialogHistory:this.state.dialogHistory}),this.getTextInputForm())}}]),t}(s.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(s.a.createElement(f,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},49:function(e,t,n){e.exports=n(432)},54:function(e,t,n){},55:function(e,t,n){e.exports=n.p+"static/media/logo.5d5d9eef.svg"},56:function(e,t,n){}},[[49,1,2]]]);
//# sourceMappingURL=main.1ecc1409.chunk.js.map