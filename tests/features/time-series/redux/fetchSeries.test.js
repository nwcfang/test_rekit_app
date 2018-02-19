import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  TIME_SERIES_FETCH_SERIES_BEGIN,
  TIME_SERIES_FETCH_SERIES_SUCCESS,
  TIME_SERIES_FETCH_SERIES_FAILURE,
  TIME_SERIES_FETCH_SERIES_DISMISS_ERROR,
} from 'src/features/time-series/redux/constants';

import {
  fetchSeries,
  dismissFetchSeriesError,
  reducer,
} from 'src/features/time-series/redux/fetchSeries';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('time-series/redux/fetchSeries', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchSeries succeeds', () => {
    const store = mockStore({});

    return store.dispatch(fetchSeries())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', TIME_SERIES_FETCH_SERIES_BEGIN);
        expect(actions[1]).to.have.property('type', TIME_SERIES_FETCH_SERIES_SUCCESS);
      });
  });

  it('dispatches failure action when fetchSeries fails', () => {
    const store = mockStore({});

    return store.dispatch(fetchSeries({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', TIME_SERIES_FETCH_SERIES_BEGIN);
        expect(actions[1]).to.have.property('type', TIME_SERIES_FETCH_SERIES_FAILURE);
        expect(actions[1]).to.have.nested.property('data.error').that.exist;
      });
  });

  it('returns correct action by dismissFetchSeriesError', () => {
    const expectedAction = {
      type: TIME_SERIES_FETCH_SERIES_DISMISS_ERROR,
    };
    expect(dismissFetchSeriesError()).to.deep.equal(expectedAction);
  });

  it('handles action type TIME_SERIES_FETCH_SERIES_BEGIN correctly', () => {
    const prevState = { fetchSeriesPending: false };
    const state = reducer(
      prevState,
      { type: TIME_SERIES_FETCH_SERIES_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchSeriesPending).to.be.true;
  });

  it('handles action type TIME_SERIES_FETCH_SERIES_SUCCESS correctly', () => {
    const prevState = { fetchSeriesPending: true };
    const state = reducer(
      prevState,
      { type: TIME_SERIES_FETCH_SERIES_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchSeriesPending).to.be.false;
  });

  it('handles action type TIME_SERIES_FETCH_SERIES_FAILURE correctly', () => {
    const prevState = { fetchSeriesPending: true };
    const state = reducer(
      prevState,
      { type: TIME_SERIES_FETCH_SERIES_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchSeriesPending).to.be.false;
    expect(state.fetchSeriesError).to.exist;
  });

  it('handles action type TIME_SERIES_FETCH_SERIES_DISMISS_ERROR correctly', () => {
    const prevState = { fetchSeriesError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: TIME_SERIES_FETCH_SERIES_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchSeriesError).to.be.null;
  });
});
