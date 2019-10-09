import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {shallow, mount} from 'enzyme';
import sinon from 'sinon';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders conversation starter', () => {
  const wrapper = mount(<App test={true}/>);
  const firstMessage = 
  <div class="container watson">
    <p>Watson: Hello. How are you?</p>
    <span class="time-left">11:11</span>
  </div>;
  expect(wrapper.contains(firstMessage)).toEqual(true);
  expect(wrapper.state().sessionId).toEqual(1234);
});

it('initial state setup', () => {
  const wrapper = shallow(<App test={true}/>, {disableLifecycleMethods: true});
  expect(wrapper.state().dialogHistory).toEqual([]);
  expect(wrapper.state().userInput).toEqual('');
  expect(wrapper.state().userInputHistory).toEqual([]);
  expect(wrapper.state().sessionId).toEqual(null);
});

it('test change text method', () => {
  const wrapper = shallow(<App test={true}/>);
  expect(wrapper.state().userInput).toEqual("test");

});