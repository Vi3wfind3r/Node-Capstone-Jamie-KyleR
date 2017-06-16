/* global $ setDashboard*/
'use strict';
$(document).ready(function() {
  setDashboard();
  listenForSearch();
});

//function making API call//
function getDataFromAPI(ticker) {
  return fetch(`/api?symbol=${ticker}`)
  .then(temp =>  temp.json());
}

//Call this to empty results from search on Trade page before a new search's results are displayed//
function emptyResults() {
  $('#search-results').empty();
}

//Event listener for search submission on Trade page//
function listenForSearch () {
  $('#search-form').submit(function(event) {
    event.preventDefault();
    console.log('This is working');
    getDataFromAPI($(this).find('input').val())
    .then(res => renderResults(res.results[0]));
  });
}

function postPurchasedSecurityOnDashboard(link, symbol, name, initialPrice, numShares) {
  $.ajax({
    url: '/security',
    type: 'POST',
    data: JSON.stringify({
      link: link,
      symbol: symbol,
      name: name,
      initialPrice: initialPrice,
      numShares: numShares
    }),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: 'success'
  });
}

function renderResults(security) {
  emptyResults();
  $('#search-results').append(
    `<div class="info-box">
    <div class="ticker"><h4>${security.symbol}</h4></div>
    <div class="ticker-name"><h4>${security.name}</h4></div>
    <p class="share-price">Share Price: ${security.lastPrice}</p>
    <p>
        <button id="order" type="button" class="btn btn-success btn-lg" data-toggle="modal" data-target="#orderModal" data-whatever="order">
          Order
        </button>

        <div class="modal fade" id="orderModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Place Trade</h4>
              </div>
              <div class="modal-body">
                <h4>${security.symbol}</h4>
                <p class="share-price">Share Price: ${security.lastPrice}</p>
                <p>
                  Shares to buy:
                  <input required type="text" pattern="\d*" class="accountvalue" placeholder="e.g. 10">
                </p>
                  <label>
                    <input type="checkbox"> Buy max
                  </label>
                <p class="total-sell-amt">Cost: </p>
                <!--<p class="account-balance">Account balance: </p>-->
              </div>
              <div class="modal-footer">
                <button type="button" id="order-buy" class="btn btn-success" data-dismiss="modal">Buy</button>
                <button type="button" id="short-sell" class="btn btn-primary" data-dismiss="modal">Short Sell</button>
                <button type="button" id="cancel-order" class="btn btn-danger" data-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
    </p>
  </div>`
  ).find('#order-buy').click(function(event) {
    console.log('I have clicked Buy on Trade');
    postPurchasedSecurityOnDashboard(portfolio.link, security.symbol, security.name, security.lastPrice);
    //link, symbol, name, initialPrice, numShares
  });
  $('#short-sell').click(function(event) {
    console.log('I have clicked on short sell');
  });
  $('#cancel-order').click(function(event) {
    console.log('I have clicked on cancel');
  });
  $('input[type="checkbox"]').change(function() { 
    console.log(123);
  });
}

