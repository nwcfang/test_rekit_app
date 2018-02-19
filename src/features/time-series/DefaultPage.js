/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Line, LineChart } from 'recharts';

import * as actions from './redux/actions';

const hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {
  // null and undefined are "empty"
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== 'object') return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (const key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

function addIdToField(inputData) {
  const data = inputData || [];
  const result = [];
  /*    Date" 1 : "Open" 2 : "High" 3 : "Low" 4 : "Close" 5 : "Volume" 6 : "Ex-Dividend" 7 : "Split Ratio" 8 : "Adj. Open" 9 : "Adj. High" 10 : "Adj. Low" 11 : "Adj. Close" 12 : "Adj. Volume
  * */
  let iter = 0;
  data.map((arr) => {
    result.push({name: iter += 1, open: arr[1]});
    return 'OK';
  });
  return result;
}

export class DefaultPage extends Component {
  static propTypes = {
    timeSeries: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.actions.fetchSeries();
  }

  render() {
    const { timeSeries } = this.props;
    const isEmptyData = isEmpty(timeSeries.data);
    let data = [];
    if (!isEmptyData) {
      data = addIdToField(timeSeries.data.data);
    }
    return (
      <div className="time-series-default-page">
        {timeSeries.fetchSeriesPending ? (
          <div>Loading...</div>
        ) : isEmptyData ? (
          <div>Empty</div>
        ) : (
          <div>
            <LineChart width={1170} height={400} data={data}>
              <Line
                type="monotone"
                dot={false}
                dataKey="open"
                stroke="#8884d8"
              />
            </LineChart>
            <table className="simple-little-table">
              <tr>{timeSeries.data.column_names.map(name => (
                <th key={name}> {name} </th>))}
              </tr>
              {timeSeries.data.data.map((arr, i) => (
                <tr key={i}>
                  {arr.map((dataField, index) => (
                    <td key={index}>{dataField}</td>
                  ))}
                </tr>
              ))}
            </table>
          </div>
        )}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    timeSeries: state.timeSeries,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...actions}, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultPage);
