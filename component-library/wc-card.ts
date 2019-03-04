import { WcBase, html } from './wc-base';
import { property, css } from 'lit-element';

export class WcCard extends WcBase {
  constructor() {
    super();
  }

  @property({type: Object, reflect: false, attribute: false}) cssVariables = {};

  render () {
    return html`
      <style>
        :host {
          flex: 0 1 auto;
          box-shadow: 0 2px 1px -1px rgba(0,0,0,.2),
                      0 1px 1px 0 rgba(0,0,0,.14),
                      0 1px 3px 0 rgba(0,0,0,.12);
          border-radius: 4px;
        }
      </style>

      <slot></slot>
    `;
  }
}

customElements.define('wc-card', WcCard);
