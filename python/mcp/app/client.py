import flask

app = flask.Flask(__name__)

@app.route('/client')
def client():
    return '11'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=7777)