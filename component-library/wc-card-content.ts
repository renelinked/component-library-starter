import { WcBase, html } from './wc-base';
import { property, css } from 'lit-element';

export class WcCardContent extends WcBase {
  constructor () {
    super();
  }

  @property() cssVariables = {
    secondaryColor: '--secondary-text-color',
    secondaryTextSize: '--secondary-text-size'
  };

  render () {
    return html`
      <style>
        .card-content-slot {
          padding: 5px;
          font-size: var(${this.cssVariables.secondaryTextSize});
          background-color: var(${this.cssVariables.secondaryColor});
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      </style>

      <div class="card-content-slot">
        <slot></slot>
      </div>
    `;
  }
}
customElements.define('wc-card-content', WcCardContent);
