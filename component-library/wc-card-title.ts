import { WcBase, html } from './wc-base';
import { property, css } from 'lit-element';

export class WcCardTitle extends WcBase {
  constructor () {
    super();
  }

  @property({type: Object, reflect: false, attribute: false}) cssVariables =
  {
      primaryTextSize: '--primary-text-size',
      primaryFontFamily: '--primary-font-family',
      secondaryColor: '--secondary-color'
  };

  render () {
    return html`
      <style>
        :host {
          width: 100%;
          height: 100%;
          font-size: var(${this.cssVariables.primaryTextSize});
          font-family: var(${this.cssVariables.primaryTextSize});
        }
        .card-title-slot {
          padding: 5px;
          background-color: var(${this.cssVariables.secondaryColor});
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }
      </style>

      <div class="card-title-slot">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('wc-card-title', WcCardTitle);
