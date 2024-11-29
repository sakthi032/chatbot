from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from different origins

# Set up logging
logging.basicConfig(level=logging.DEBUG)

@app.route("/chat", methods=["POST"])
def chatbot_response():
    data = request.json  # Get the data from the request
    user_message = data.get("message", "")  # Get the message sent by user

    # Check if the message is empty
    if not user_message:
        return jsonify({"error": "Message is required"}), 400  # Bad request

    try:
        # Send the message to OpenAI for a response
        response = openai.Completion.create(
            engine="text-davinci-003",  # Use the OpenAI engine
            prompt=user_message,       # Pass the user message
            max_tokens=100             # Limit the length of the response
        )
        chatbot_reply = response["choices"][0]["text"].strip()  # Get the chatbot reply
        return jsonify({"reply": chatbot_reply})  # Send the reply back to React Native

    except openai.error.OpenAIError as e:
        # If there’s an error with OpenAI API
        app.logger.error(f"OpenAI error: {e}")
        return jsonify({"error": f"OpenAI error: {e}"}), 500  # Internal server error

    except Exception as e:
        # If there's any other error
        app.logger.error(f"Unexpected error: {e}")
        return jsonify({"error": f"Unexpected error: {e}"}), 500  # Internal server error

if __name__ == "__main__":
    app.run(host='192.168.76.126', port=5000)  # Make Flask accessible on your local network
