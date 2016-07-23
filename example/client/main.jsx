import React from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { create } from '/imports/lib/create';

const ReactMathJax = create();

Meteor.startup(function () {
  render(<App/>, document.getElementById('render-target'));
});

class App extends React.Component {
  render () {
    return (
      <ReactMathJax>
        $x^2+y^2=z^2$
      </ReactMathJax>
    );
  }
}
