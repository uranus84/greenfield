import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Login from '../client/components/Login.jsx';

Enzyme.configure({ adapter: new Adapter() });

let mock = new MockAdapter(axios);

describe('<Login />', () => {
  const wrapper = mount(<Login />);
  it('component should initialize a username and password state', () => {
		expect(wrapper.state().username).to.exist;
		expect(wrapper.state().password).to.exist;
  });
  it('component should update state when user updates input fields', () => {
		wrapper.find('#username').simulate('change', {target: {value: 'foo'}});
    wrapper.find('#password').simulate('change', {target: {value: 'bar'}});
		expect(wrapper.state().username).to.equal('foo');
		expect(wrapper.state().password).to.equal('bar');
  });
  it('component should redirect if user and password is found', () => {
    mock.onPost('/login').reply(200,
      {
        username: 'Bob Dylan',
        todaysChores: [
          {
            chore_name: 'Wash dishes',
            next_date: '2017-11-19 09:00:00',
            frequency: 'daily',
            last_date_completed: '2017-11-18 09:00:00',
            completed: true,
          }
        ],
        futureChores: [
          {
            chore_name: 'take out trash',
            next_date: '2017-12-19 09:00:00',
            frequency: 'daily',
            last_date_completed: '2017-11-18 09:00:00',
            completed: false,
          }
        ]
      }
    );
    wrapper.instance().submitLoginCredentials().then((response) => {
      expect(response.status).toEqual(200);
      expect(response.username).toEqual('Bob Dylan');
      expect(response.todaysChores[0].chore_name).toEqual('Wash dishes');
      expect(response.futureChores[0].frequency).toEqual('daily')
    });
  });
  it('component should handle errors if user and password is not found', () => {
    mock.onPost('/login').reply(500, {error: 'User is not found'});
    wrapper.instance().submitLoginCredentials().then((response) => {
      expect(response.status).toEqual(500);
      expect(response.error).toEqual('User is not found');
    });
  });
  it('component should redirect when signup button is clicked', () => {
    mock.onGet('/signup').reply(200, {message: 'Redirecting to signup'});
    wrapper.instance().submitLoginCredentials().then((response) => {
      expect(response.status).toEqual(200);
      expect(response.error).toEqual('Redirecting to signup');
    });
  });
});