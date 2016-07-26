import React from 'react';
import { Parser } from 'commonmark';
import ReactRenderer from 'commonmark-react-renderer';
import { create } from '../lib/create';

const ReactMathJax = create();
const parser = new Parser();

export class ReactMarkdown extends React.Component {

  constructor (props) {
    super(props);
    this.renderer = new ReactRenderer({
      renderers: {
        CodeBlock: function (props) {
          if (props.language === 'latex') {
            return (<ReactMathJax>{props.literal}</ReactMathJax>);
          }
          return ReactRenderer.renderers.CodeBlock(props);
        }
      }
    });
  }

  render () {
    const ast = parser.parse(this.props.source);
    const walker = ast.walker();
    let event;
    while (event = walker.next()) {
      console.log('NODE', event.node);
    }
    return (
      <div>
        {this.renderer.render(ast)}
      </div>
    );
  }
}
