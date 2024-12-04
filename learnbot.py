from fastapi import FastAPI, Request
import openai
import os
import openai
openai.api_key = os.getenv("OPENAI_API_KEY")

# Function to get a response from GPT
def ask_gpt(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # or "gpt-4"
        messages=[
            {"role": "system", "content": "You are LearnBot, an educational assistant that focuses on Math, Science, and English. Provide clear, concise answers."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content

# Example usage
user_question = "What is the Pythagorean theorem?"
bot_response = ask_gpt(user_question)
print(bot_response)
