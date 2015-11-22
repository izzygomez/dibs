// Wrap in an immediately invoked function expression.
(function() {

  $(document).on('click', '#servedButton', function(evt) {
    evt.preventDefault();
    var item = $(this).parent();
    var id = item[0].id;
    $.post(
        '/queue/served',
        { _id: id }
    ).done(function(response) {
      console.log("drink served")
    }).fail(function(responseObject) {
        var response = $.parseJSON(responseObject.responseText);
        $('.error').text(response.err);
    });
  });

  // Create queue 

  
})();