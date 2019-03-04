import { LitElement, html, property } from 'lit-element';

class WcBase extends LitElement {

  @property({type: Object, reflect: false, attribute: false}) cssVariables = {};
}

export { WcBase, html };
