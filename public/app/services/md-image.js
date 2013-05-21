//  This function takes uploaded items and creates a path for them
//

app.filter('mdImage', function() {
  return function(input) {
    if (input) {
      return ['![',input.name, '](/uploads/',input.path,')'].join('');
    }
  };
});