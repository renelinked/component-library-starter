import { FdsBase, html } from './fds-base';
class FdsLink extends FdsBase {
  static get properties () {
    return {
      text: {
        type: String
      },
      href: {
        type: String
      }
    };
  }

  get cssVariables () {
    return {
      primaryTextColor: '--primary-text-color',
      primaryFontFamily: '--primary-font-family',
      primaryFontWeight: '--primary-font-weight'
    };
  }

  constructor () {
    super();
  }

  render () {
    return html`
      <style>
        a.fds-link {
          color: var(${this.cssVariables.primaryTextColor});
          font-family: var(${this.cssVariables.primaryFontFamily});
          font-weight: var(${this.cssVariables.primaryFontWeight});
          text-decoration: none;
        }
        a.fds-link:hover {
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
      ${this.href ? html`<a draggable=false href="${this.href}" class="fds-link noselect">${this.text}</a>`
                  : html`<a draggable=false class="fds-link noselect">${this.text}</a>`}
    `;
  }
}

customElements.define('fds-link', FdsLink);
