import { LitElement, html, property } from 'lit-element';

class TestBase extends LitElement {

  @property({type: Object, reflect: false, attribute: false}) cssVariables = {};
}

export { TestBase, html };
