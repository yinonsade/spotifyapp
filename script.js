// Document has been loaded
$( document ).ready(function() {
     // Helper Function to Extract Access Token for URL
    const getUrlParameter = (sParam) => {
      let sPageURL = window.location.search.substring(1),////substring will take everything after the https link and split the #/&
          sURLVariables = sPageURL != undefined && sPageURL.length > 0 ? sPageURL.split('#') : [],
          sParameterName,
          i;
      let split_str = window.location.href.length > 0 ? window.location.href.split('#') : [];
      sURLVariables = split_str != undefined && split_str.length > 1 && split_str[1].length > 0 ? split_str[1].split('&') : [];
      for (i = 0; i < sURLVariables.length; i++) {
          sParameterName = sURLVariables[i].split('=');
          if (sParameterName[0] === sParam) {
              return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
          }
      }
  };

    // Get Access Token
    const accessToken = getUrlParameter('access_token');

    // AUTHORIZE with Spotify (if needed)
    // *************** REPLACE THESE VALUES! *************************
    let client_id = '1ab48fdbdb764caab41ac1a2c37d79db';
    // Use the following site to convert your regular url to the encoded version:
    // https://www.url-encode-decode.com/
    let redirect_uri = 'https%3A%2F%2Fyinonsade.github.io%2FsotifyAPIJS'; // GitHub Pages URL or whatever your public url to this app is
    // *************** END *************************

    const redirect = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}`;
    // Don't authorize if we have an access token already
    // if(accessToken == null || accessToken == "" || accessToken == undefined){
    //   window.location.replace(redirect);
    // }


    let userInput,
    userInputLimit;
    

  //triger the search on Enter pressed
  $("input").on("keydown", function (event) {
    if (event.which === 13) {
      getNewResults();
    }
  });

  //triger the search on mouse clicked
  $(".search-button").on("click", function () {
    getNewResults();
  });

  // get Info from user input
  function getNewResults() {
    userInput = encodeURIComponent($('input[name="user-input"]').val());
    userInputLimit = encodeURIComponent($('input[name="limit-input"]').val());
    if (userInputLimit == 0) {
      userInputLimit = 10;
    }
    ajaxRequest();
  }
  accessToken = 'BQBT2I6JzETC_ZCJDc9mKcXpPnl_ouiSClGMWdMSZe45_4td-wStd6gDmQEF1CSpy90djF9vvkGaXjhbkE8BZKaQv5DcTeGr-8xHZ6moLfk-GuVb_sGnPyGeBkP0wEN3pKWzXZ9vTWwy6ytEFttfcmtuw3B1Oyggj4o';
  //call the api
  function ajaxRequest() {
    $.ajax({
        url: `https://api.spotify.com/v1/search?q=${userInput}&type=track`,
        type: 'GET',
        headers: {
            'Authorization' : 'Bearer ' + accessToken
        },
        success: function(data) {
          console.log(data);
            dataTable(data);
        }
        
      });
  }

function dataTable(dataSet) {

  let newDataArray = [];
  let resultsArray = dataSet.tracks.items;
  for (i = 0; i < resultsArray.length; i++) {
    let tempArray = [];

    let artistName = resultsArray[i].artists[0].name,
    songName = resultsArray[i].name,
    artistUrl = '<a href="'+ resultsArray[i].external_urls.spotify +'" target="_blank">open on Spotify!</a>' ,
    albumRelaseDate = resultsArray[i].album.release_date,
    preview = resultsArray[i].preview_url,
    albumImage = '<img src="'+ resultsArray[i].album.images[0].url +'" alt="">';
    
    tempArray = [songName,artistName,albumRelaseDate,artistUrl,albumImage, preview, ];

    newDataArray.push(tempArray);

    };
  $("#example").DataTable({
    data: newDataArray,
    columns: [
      { title: "Song" },
      { title: "Artist" },
      { title: "Release year" },
      { title: "Link" },
      { title: "Image"}

      
    ],
  })

}

})











