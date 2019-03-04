import { WcBase, html } from './wc-base';
import { property, css } from 'lit-element';

export class WcLink extends WcBase {

  @property({type: String}) text = '';

  @property({type: String}) href = '';

  @property({type: Object, reflect: false, attribute: false}) cssVariables = 
  {
    primaryTextColor: '--primary-text-color',
    primaryFontFamily: '--primary-font-family',
    primaryFontWeight: '--primary-font-weight'
  };

  constructor () {
    super();
  }

  render () {
    return html`
      <style>
        a.wc-link {
          color: var(${this.cssVariables.primaryTextColor});
          font-family: var(${this.cssVariables.primaryFontFamily});
          font-weight: var(${this.cssVariables.primaryFontWeight});
          text-decoration: none;
        }
        a.wc-link:hover {
          text-decoration: underline;
          cursor: pointer;
        }

        .noselect {
          -webkit-touch-callout: none; /* iOS Safari */
          -webkit-user-select: none; /* Safari */
          -khtml-user-select: none; /* Konqueror HTML */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
        }
      </style>
      ${this.href ? html`<a draggable=false href="${this.href}" class="wc-link noselect">${this.text}</a>`
                  : html`<a draggable=false class="wc-link noselect">${this.text}</a>`}
    `;
  }
}

customElements.define('wc-link', WcLink);
