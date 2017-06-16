/* global $ portfolio */
'use strict';

///this is formatting the money value into something that looks like funds///
function formatMoney(m) {
    /* 100000 => $100,000 */
    return m.toLocaleString('en-US', 
                        { style: 'currency', 
                        currency: 'USD' });
}


///this is setting the dashboard to name and values to equal what was submitted///
function setDashboard() {
  $('#portfolio-name').html(portfolio.name);
  $('#portfolio-value').html(formatMoney(portfolio.value));
}