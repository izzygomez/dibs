// Main Author: Daniel Lerner

// Wrap in an immediately invoked function expression.
(function() {

/**
* Sends command to pop next drink on queue now that it has been served. 
**/
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
})();