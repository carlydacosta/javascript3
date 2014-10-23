import json

from flask import Flask, request, render_template, make_response

from api import wall_list, wall_add, wall_error, wall_clear


app = Flask(__name__)

# The "secret key" is needed for the Flask session machinery. In a real
# application, this should be an unguessable string and should NOT be
# checked into version control. Typically, one stores this as an
# environmental variable outside of the Flask app and gets it with
# os.environ['MY_SECRET_KEY']. For our exercise purposes, though, it's
# fine to have this here.
app.secret_key = 'a4c96d59-57a8-11e4-8b97-80e6500ee2f6'


@app.route("/")
def index():
    """Return index page."""
    return render_template("wall.html")


def _convert_to_JSON(result):
    """Convert result object to a JSON web request."""

    # In order for us to return a response that isn't just HTML, we turn our
    # response dictionary into a string-representation (using json.dumps),
    # then use the flask `make_response` function to create a response object
    # out of this.
    response = make_response(json.dumps(result))

    # We can then set some headers on this response object:

    # Access-Control-Allow-Origin isn't needed for this example, but it's
    # a demonstration of a useful feature: since it should be safe to allow
    # Javascript from websites other than ours to get/post to our API, we
    # explicitly allow this.
    response.headers['Access-Control-Allow-Origin'] = "*"

    # Setting the MIMETYPE to JSON's will explicitly mark this as JSON;
    # this can help some client applications understand what they get back.
    response.mimetype = "application/json"

    return response


@app.route("/api/wall/add", methods=['POST'])
def add_message():
    """Add a message and return list of wall messages as JSON."""

    # Get the message from the "m" argument passed in the POST object { m : msg }.
    # (to get things from a GET response, we've used request.args.get();
    # this is the equivalent for getting things from a POST response)
    msg = request.form.get('m').strip()  #strip is just removing the whitespace on either side of my message

    if msg is None:
        result = wall_error("You did not specify a message to set.")

    elif msg == "":
        result = wall_error("Your message is empty")

    else:
        result = wall_add(msg) # function wall_add(msg) in api.py that returns a list of all wall messages from wall_list() in api.py

    return _convert_to_JSON(result)  # a list of wall messages in the session


@app.route("/api/wall/list")
def list_messages():
    """Return list of wall messages as JSON."""

    

    result = wall_list()
    return _convert_to_JSON(result)

@app.route("/api/wall/clear")
def clear_messages():
    """Returns an empty list of wall messages, except for default message, as JSON."""
    #result is the default message session 
    result = wall_clear()
    #converting it to JSON to output to browser
    return _convert_to_JSON(result)


if __name__ == "__main__":
    app.run(debug=True)