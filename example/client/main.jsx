import React from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { create } from '/imports/lib/create';
import { ReactMarkdown } from '/imports/components/ReactMarkdown.jsx';

const ReactMathJax = create();

Meteor.startup(function () {
  render(<App/>, document.getElementById('render-target'));
});

class App extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      source: '# Fermat\'s equation\n\n```latex\n\\frac{x^n+y^n}{z^n}=1\n```\n\nInline <TeX>x^n+y^n=z^n</TeX>'
    };
    this.hanldeUpdate = this.hanldeUpdate.bind(this);
  }

  hanldeUpdate (e) {
    this.setState({ source: e.currentTarget.value });
  }

  render () {
    const { source } = this.state;
    return (
      <div>
        <textarea value={source} onChange={this.hanldeUpdate}/>
        <ReactMarkdown source={source}/>
        <h1>Static render</h1>
        <ReactMathJax>
          {"\\frac{x^n+y^n}{z^n}=1"}
        </ReactMathJax>
      </div>
    );
  }
}
