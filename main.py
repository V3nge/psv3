import os
import json
import hashlib
from flask import Flask, send_from_directory, request, jsonify, render_template_string
from flask_socketio import SocketIO, emit
import urllib.parse

app = Flask(__name__)
socketio = SocketIO(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
GAMES_DIR = os.path.join(BASE_DIR, "Public/games")
REPORT_FILE = os.path.join(BASE_DIR, "private/report.js")

with open(REPORT_FILE, 'r') as f:
    report_js = f.read()

constructed_games_list = []

def construct_games_list():
    global constructed_games_list
    try:
        files = os.listdir(GAMES_DIR)
        constructed_games_list = files
    except Exception as e:
        print(f"Error reading directory: {e}")

construct_games_list()

@app.route('/games/', methods=['GET'])
def games():
    return jsonify(constructed_games_list)

@app.route('/games/<game_name>/', methods=['GET'])
def game(game_name):
    try:
        game_path = os.path.join(BASE_DIR, f"Public/games/{game_name}/index.html")
        with open(game_path, 'r') as f:
            game_html = f.read()
        return render_template_string(f"{game_html}<script>{report_js}</script>")
    except FileNotFoundError:
        return "Game not found", 404
    except Exception as e:
        print(f"Error reading file: {e}")
        return "Internal server error", 500

path_stats = {}

def update_count(path, key):
    if path not in path_stats:
        path_stats[path] = {'starts': 0, 'recurring': 0}
    path_stats[path][key] += 1

@app.route('/s', methods=['POST'])
def game_start():
    path = request.args.get('u')
    if not path:
        return jsonify({'error': 'Path is required'}), 400
    update_count(path, 'starts')
    return '', 200

@app.route('/r', methods=['POST'])
def game_recurring():
    path = request.args.get('u')
    if not path:
        return jsonify({'error': 'Path is required'}), 400
    update_count(path, 'recurring')
    return '', 200

import asyncio
from hashlib import sha256

async def sha256_hash(message: str) -> str:
    return sha256(message.encode('utf-8')).hexdigest()

users = []
websockets = []
rooms = []

def encodeURIComponent(value):
    return urllib.parse.quote(value, safe="")

def create_private_room(name):
    rooms.append(name)
    return encodeURIComponent(name)

@socketio.on('message')
async def handle_message(message):
    msg_type = message.get('type')

    if msg_type == 'tempacc':
        users.append(message.get('name'))
        websockets.append(request.sid)
        emit('message', {"type": "ok_tempacc"})

    elif msg_type == 'tempacc_gsend':
        sender = message.get('sender')
        if sender in users:
            emit('message', {"type": "ok"})
            sender_hash = await sha256_hash(sender)
            for ws in websockets:
                emit('message', {"type": "gsend_r", "msg": message.get('msg'), "sender": sender_hash}, to=ws)
        else:
            emit('message', {"type": "nuh uh"})

    elif msg_type == 'newpri':
        code = message.get('code')
        room_name = create_private_room(code)
        emit('message', {"type": "pri", "msg": room_name, "sender": sender_hash})

    else:
        emit('message', {"type": "unknowntype", "value": msg_type})

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'public'), filename)

@app.route("/")
def mainPath():
    return send_from_directory(os.path.join(BASE_DIR, 'public'), "index.html")

@app.route("/live-chat/")
def liveChat():
    return send_from_directory(os.path.join(BASE_DIR, 'public'), "live-chat/index.html")

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8000)