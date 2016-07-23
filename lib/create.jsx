import React from 'react';
import { MathJaxPromise } from './MathJaxPromise.js';

export function create () {

  class ReactMathJax extends React.Component {
    constructor (props) {
      super(props);
    }
    componentDidMount () {
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
    render () {
      const { children } = this.props;
      return (
        <span ref='mathjax'>
          {children}
        </span>
      );
    }
  }
  
  return ReactMathJax;
}
