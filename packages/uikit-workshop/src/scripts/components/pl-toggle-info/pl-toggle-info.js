import { define, props } from 'skatejs';
import { h } from 'preact';

import ShowIcon from '../../../icons/eye.svg';
import HideIcon from '../../../icons/eye-off.svg';

import { store } from '../../store.js'; // connect to the Redux store.
import { updateDrawerState } from '../../actions/app.js'; // redux actions
import { BaseComponent } from '../base-component.js';

@define
class InfoToggle extends BaseComponent {
  static is = 'pl-toggle-info';

  constructor(self) {
    self = super(self);
    return self;
  }

  static props = {
    _drawerOpened: props.boolean,
  };

  _stateChanged(state) {
    this._drawerOpened = state.app.drawerOpened;
    this.isViewallPage = state.app.isViewallPage;
  }

  render({ _drawerOpened, isViewallPage }) {
    return (
      <button
        class="pl-c-tools__action"
        onClick={_ => store.dispatch(updateDrawerState(!_drawerOpened))}
      >
        <span class="pl-c-tools__action-text">
          {_drawerOpened
            ? `Hide ${isViewallPage ? 'all ' : ''}Pattern Info`
            : `Show ${isViewallPage ? 'all ' : ''}Pattern Info`}
        </span>
        <span class="pl-c-tools__action-icon">
          {_drawerOpened ? (
            <HideIcon height={16} width={16} viewBox="0 0 24 24" fill="currentColor" />
          ) : (
            <ShowIcon height={16} width={16} viewBox="0 0 24 24" fill="currentColor" />
          )}
        </span>
      </button>
    );
  }
}

export { InfoToggle };
