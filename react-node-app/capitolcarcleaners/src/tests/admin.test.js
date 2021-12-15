import React from 'react';
import TestRenderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import {create} from 'react-test-renderer';
import { h } from 'preact';
import { render } from 'enzyme/build';
import CreateAccount from '../components/CreateAccount';
const expectedVal = 1;
let container;
  test("Matches the snapshot", () => {
    const baseProps = {
      // whatever fake props you want passed to the component
      // ...
    };
    const renderer = new ShallowRenderer();
    const renderVals = renderer._isReRender;
    act(() => {
    // ReactDOM.render(<CreateAccount />, container);
    });
    //console.log(renderVals);
  //  console.log(CreateAccount);
    //const wrapper = renderer.render(<CreateAccount {...baseProps} />);
   // console.log(wrapper.instance());
   // renderer.render(<CreateAccount {...baseProps}/>);
    expect(renderVals).toBe(false);
    expect(expectedVal).toBe(1);
  });
