import { unsafeCSS, BoltElement, customElement, html } from '@bolt/element';
import classNames from 'classnames/bind';
import bodyStyles from './_card-body.scss';
let cx = classNames.bind(bodyStyles);

@customElement('bolt-card-body')
class BoltCardBody extends BoltElement {
  static get styles() {
    return [unsafeCSS(bodyStyles)];
  }

  render() {
    const classes = cx('c-bolt-card__body');
    const { tag } = this.tag || 'div'; // fallback if the `tag` context isn't available for some reason

    return html`
      ${tag === 'figure'
        ? html`
            <figcaption class="${classes}">
              ${this.slotify('default')}
            </figcaption>
          `
        : html`
            <div class="${classes}">${this.slotify('default')}</div>
          `}
    `;
  }
}

export { BoltCardBody };