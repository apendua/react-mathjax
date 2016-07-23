import React from 'react';

export class ReactMathJax extends React.Component {
  constructor (props) {
    super(props);
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
