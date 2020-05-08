// Returns a hexadecimal 6-digit colour code based on the given string
function string_to_color(given_string) {
  var hash = 0;
  for (var i = 0; i < given_string.length; i++) {
    hash = given_string.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}