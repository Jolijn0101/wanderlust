// Foursquare API Info
const clientId = 'clientId or apikey here';
const clientSecret = 'client secret here';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';

// divs array for later use
const $venueDivs = [
  $('#venue1'),
  $('#venue2'),
  $('#venue3'),
  $('#venue4'),
  $('#venue5'),
  $('#venue6'),
  $('#venue7'),
  $('#venue8'),
  $('#venue9'),
  $('#venue10'),
];

// makes the api call and returns the needed data
const getVenues = async () => {
  // gets the name of the city typed in
  const city = $('#city').val();
  // url for making the api call
  const urlToFetch = `${url}${city}&limit=10&client_id=${clientId}&client_secret=${clientSecret}&v=20220111`;
  // tries to make the api call and logs an error in case it failed
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const venues = jsonResponse.response.groups[0].items.map((item) => item.venue);
      return venues;
    }
  } catch (error) {
    console.log(error);
  }
};

// Render functions
const renderVenues = (venues) => {
  // let the user know if there isn't any information
  if (!venues) {
    $('#text-box').append('<h2>⛔️ City or village not found. try again</h2>');
  }
  // display the info in the dom
  else {
    // makes the container element visible
    $('.container').css('display', 'inline');
    // shrinks the size of the main part
    $('.main').css('height', '400px');
    // creates the cards and displays them in the dom
    $venueDivs.forEach(($venue, index) => {
      const venue = venues[index];
      const venueIcon = venue.categories[0].icon;
      $venue.append(`<h2>${venue.name}</h2>
    <div class="img-container">
      <img class="venueimage" src="${venueIcon.prefix + 'bg_64' + venueIcon.suffix}" />
    </div>
    <div class="venue-info">
      <h3>Category:</h3>
      <p>${venue.categories[0].name}</p>
      <br />
      <h3>Address:</h3>
      <p>${venue.location.address ? venue.location.address : ''}</p>
      <p>${venue.location.city ? venue.location.city : ''}</p>
      <p>${venue.location.country ? venue.location.country : ''}</p>
    </div>`);
    });
    $('#destination').append(`<h2>${venues[0].location.city}</h2>`);
  }
};

const executeSearch = () => {
  // makes the venue cards invisible when searching
  $('.container').css('display', 'none');
  // Remove the info from the previous search
  $venueDivs.forEach((venue) => venue.empty());
  $('#destination').empty();
  $('#text-box h2').remove();

  // get info of this search and display in the dom
  getVenues().then((venues) => {
    renderVenues(venues);
    // change background main to image from the searched city
    $('#image-container').css('background-image', `url('https://source.unsplash.com/1600x900/?" + ${venues[0].location.city} + "')`);
  });
  return false;
};
//adds an event handler to the submit button
$('#button').click(executeSearch);
