$(document).ready(function () {
  // Helper Function to Extract Access Token for URL
  const getUrlParameter = (sParam) => {
    let sPageURL = window.location.search.substring(1), ////substring will take everything after the https link and split the #/&
      sURLVariables =
        sPageURL != undefined && sPageURL.length > 0 ? sPageURL.split("#") : [],
      sParameterName,
      i;
    let split_str =
      window.location.href.length > 0 ? window.location.href.split("#") : [];
    sURLVariables =
      split_str != undefined && split_str.length > 1 && split_str[1].length > 0
        ? split_str[1].split("&")
        : [];
    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split("=");
      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined
          ? true
          : decodeURIComponent(sParameterName[1]);
      }
    }
  };

  const accessToken = getUrlParameter("access_token");
  let client_id = "1ab48fdbdb764caab41ac1a2c37d79db";
  let redirect_uri = "https%3A%2F%2Fyinonsade.github.io%2Fspotifyapp"; // GitHub Pages URL or whatever your public url to this app is
  const redirect = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}`;
  if (accessToken == null || accessToken == "" || accessToken == undefined) {
    window.location.replace(redirect);
  }

  let userInput, userInputLimit;

  //Trigers the search on Enter pressed
  $("input").on("keydown", function (event) {
    if (event.which === 13) {
      getNewResults();
    }
  });

  //Trigers the search on mouse clicked
  $(".search-button").on("click", function () {
    getNewResults();
  });

  //Get Info from user input
  function getNewResults() {
    userInput = encodeURIComponent($('input[name="user-input"]').val());
    if (userInputLimit == 0) {
      userInputLimit = 10;
    }
    ajaxRequest();
  }

  //Call the api from results
  function ajaxRequest() {
    dataTable(tempData); //(REMOVE)
    $.ajax({
      url: `https://api.spotify.com/v1/search?q=${userInput}&type=track`,
      type: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      success: function (data) {
        dataTable(data);
      },
    });
  }

  //Pringing the table of results
  function dataTable(dataSet) {
    let newDataArray = [];
    let resultsArray = dataSet.tracks.items;

    for (i = 0; i < resultsArray.length; i++) {
      let tempArray = [];

      let artistName = resultsArray[i].artists[0].name,
        songName = resultsArray[i].name,
        artistUrl =
          '<a href="' +
          resultsArray[i].external_urls.spotify +
          '" target="_blank">open on Spotify!</a>',
        albumRelaseDate = resultsArray[i].album.release_date,
        albumImage =
          '<img src="' + resultsArray[i].album.images[0].url + '" alt="">';
      audioSample =
        '<audio controls> <source src="' +
        resultsArray[i].preview_url +
        '" type="audio/ogg">play</audio>';

      tempArray = [
        songName,
        artistName,
        albumRelaseDate,
        artistUrl,
        audioSample,
        albumImage,
      ];

      newDataArray.push(tempArray);
    }

    $("#customTable").DataTable({
      data: newDataArray,
      destroy: true,
      columns: [
        { title: "Song Name" },
        { title: "Artist Name" },
        { title: "Release Year" },
        { title: "Page Link" },
        { title: "Audio Sample" },
        { title: "Album Image" },
      ],
    });
  }
  //Get a random juke from api
  $("#jukeMaker").on("click", function () {
    const settings = {
      async: true,
      crossDomain: true,
      url: "https://dad-jokes.p.rapidapi.com/random/joke/png",
      method: "GET",
      headers: {
        "x-rapidapi-key": "9373b9ca91msh8c98a9bfcc3b0f5p167697jsnf8fe8739b037",
        "x-rapidapi-host": "dad-jokes.p.rapidapi.com",
      },
    };

    $.ajax(settings).done(function (response) {
      $("#jocking-line").text(
        response.body.setup + " " + response.body.punchline
      );
    });
  });
});

//Loader while ajax run
$(document).ready(function () {
  $(document).ajaxStart(function () {
    $("#wait").css("display", "block");
  });
  $(document).ajaxComplete(function () {
    $("#wait").css("display", "none");
  });
});
