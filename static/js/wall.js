$(document).ready(function () {
    // Normally, JavaScript runs code at the time that the <script>
    // tags loads the JS. By putting this inside a jQuery $(document).ready()
    // function, this code only gets run when the document finishing loading.

    $("#message-form").submit(handleFormSubmit);
    $("#clear-messages").click(handleClearMessages);
    getMessages();
});


/**
 * Handle submission of the form.
 */
function handleFormSubmit(evt) {
    evt.preventDefault();
    //set textarea to find every html element with element id = message
    var textArea = $("#message");
    //set var msg to get the first element of the value from textArea
    var msg = textArea.val();

    //print "handleform..." plus the message
    console.log("handleFormSubmit: ", msg);
    //call function below to post to the session dict
    addMessage(msg);

    // Reset the message container to be empty
    textArea.val("");
}

/**
Clear Messages handler.  Do this when someone clicks the Clear Messages button.
*/
function handleClearMessages(evt) {
    // when I click the Clear Messages button, the default would be to route me somewhere off the current page.  This prevents us from leaving the page we're on.  
    evt.preventDefault();


    $.get(      //method used to retrieve data from the server
        "/api/wall/clear",  //url (address) that we send to the server.  The server goes to this address.  In this case, the route brings us to the Python function clear_messages.  This function returns wall_clear() in JSON format, which is our 'result'.

        // when the result is received, do this function.
        function(result){
            // print to the console the session
            console.log("getMessage: ", result);
            //Call the function that actually changes the output of the template/html
            displayMessages(result);
        }
        
    );



}


/**
 * Makes AJAX call to the server and the message to it.
 */
 // msg is passed in from result of handleFormSubmit function
function addMessage(msg) {
    //the jQuery .post method tells which url we send the message to

    $.post(  //method used to submit data to be processed by the server
        "/api/wall/add",
        // this is the data we are sending to the url (in wall.py). this route uses the POST method, as seen in wall.py, and the function needs 'm'.
        {'m': msg},
        //if request succeeds, this function is run. data is the entire list / array of messages.
        function (result) {
            console.log("addMessage: ", result);
            displayMessages(result);
            displayResultStatus(result.result);
        }
    );
}

function getMessages() {
    //getting message from browser input form and inputting it into the session dictionary, then prepend, or ADD, the message to the li class html template file.
    
    // alert("wtf");

    $.get(      //method used to retrieve data from the server
        "/api/wall/list",  //url from which we are retriving data
        
        function(result){
            console.log("getMessage: ", result);
            displayMessages(result);
        }
        
    );

   
}

// this is where the html is actually being "changed"
function displayMessages(result) {   //The input is an array (list) of objects (dictionaries)

    // this function first asks for the values in the 
    var msgs = result['messages'];

    $('#message-container').empty();

    for (var i=0; i<msgs.length; i++) {

        $("#message-container").prepend(
        "<li class = 'list-group-item'>" + msgs[i]['message'] + "</li>");
    }


}
/**
 * This is a helper function that does nothing but show a section of the
 * site (the message result) and then hide it a moment later.
 */
function displayResultStatus(resultMsg) {
    var notificationArea = $("#sent-result");
    notificationArea.text(resultMsg);
    notificationArea.slideDown(function () {
        // In JavaScript, "this" is a keyword that means "the object this
        // method or function is called on"; it is analogous to Python's
        // "self". In our case, "this" is the #sent-results element, which
        // is what slideDown was called on.
        //
        // However, when setTimeout is called, it won't be called on that
        // same #sent-results element--"this", for it, wouldn't be that
        // element. We could put inside of our setTimeout call the code
        // to re-find the #sent-results element, but that would be a bit
        // inelegant. Instead, we'll use a common JS idiom, to set a variable
        // to the *current* definition of self, here in this outer function,
        // so that the inner function can find it and where it will have the
        // same value. When stashing "this" into a new variable like that,
        // many JS programmers use the name "self"; some others use "that".
        var self = this;

        setTimeout(function () {
            $(self).slideUp();
        }, 2000);
    });
}