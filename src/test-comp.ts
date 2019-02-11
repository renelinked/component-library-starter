import { TestBase, html } from './test-base';
import { property, css } from 'lit-element';

export interface TestCompProps {
  compName?: string,
  cssVariables?: Object
}

export class TestComp extends TestBase {
  static get properties () {
    return {};
  }

  @property({type: String, reflect: false, attribute: false}) compName = 'fds-header';

  @property({type: Object, reflect: false, attribute: false}) cssVariables = 
  {
    headerPadding: '--fds-header-padding',
    primaryTextSize: '--primary-text-size',
    primaryFontFamily: '--primary-font-family',
    headerBgColor: '--header-bg-color',
    primaryTextColor: '--primary-text-color'
  };

  constructor () {
    super();
  }

  static styles = [css`
    :host {
      width: 100%;
    }

    .item {
      flex: 0 1 auto;
    }
  `]

  render () {
    return html`
      <style>
        .header {
          padding: var(${this.cssVariables.headerPadding}, 10px 5px);
          font-size: var(${this.cssVariables.primaryTextSize});
          font-family: var(${this.cssVariables.primaryFontFamily});
          background-color: var(${this.cssVariables.headerBgColor});
          color: var(${this.cssVariables.primaryTextColor});
          display: flex;
          justify-content: space-between;
        }
      </style>
      <div class="header">
        <div class="item">
          <slot name="left"></slot>
        </div>
        <div class="item">
          <slot name="center"></slot>
        </div>
        <div class="item">
          <slot name="right"></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('test-comp', TestComp);

