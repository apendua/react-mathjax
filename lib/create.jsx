import React from 'react';
import { findDOMNode } from 'react-dom';
import { MathJaxPromise } from './MathJaxPromise.js';

export function create () {

  class ReactMathJax extends React.Component {
    constructor (props) {
      super(props);
    }
    update (newText) {
      if (!this.script) {
        this.script = document.createElement('script');
        this.script.type = 'math/tex; mode=display';
        findDOMNode(this.refs.mathjax).appendChild(this.script);
      }
      // TODO: Add support for other browsers ...
      this.script.textContent = newText;
    }
    componentDidMount () {
      this.update(this.props.children);
      MathJaxPromise.then((MathJax) => {
        MathJax.Hub.Queue([
          "Typeset",
          MathJax.Hub,
          this.refs.mathjax
        ], function () {
          // TODO: Implement caching here ...
        });
      });
    }
    componentWillUnmount () {
      if (this.script) {
        MathJaxPromise.then(MathJax => {
          const jax = MathJax.Hub.getJaxFor(this.script);
          if (jax) {
            jax.Remove();
          }
        });
      }
    }
    render () {
      return (
        <span ref='mathjax' />
      );
    }
  }
  
  return ReactMathJax;
}
