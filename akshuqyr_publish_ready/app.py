#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""АҚШҰҚЫР — ЦИФРЛЫҚ ШЕЖІРЕ · Flask backend
Іске қосу: python -m pip install -r requirements.txt && python app.py → http://127.0.0.1:5000
"""
import json
import os
from flask import Flask, abort, jsonify, render_template

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

app = Flask(__name__)

NAV_ITEMS = [
    {"url": "/", "label": "Басты бет"},
    {"url": "/history", "label": "Тарих"},
    {"url": "/people", "label": "Тұлғалар"},
    {"url": "/mashyryq", "label": "Машырық қажы"},
    {"url": "/time-machine", "label": "Уақыт машинасы"},
    {"url": "/map", "label": "Тарихи орындар"},
    {"url": "/treasures", "label": "Мұражай қазынасы"},
    {"url": "/reconstruction", "label": "3D реконструкция"},
    {"url": "/school", "label": "Мектеп тарихы"},
    {"url": "/archive", "label": "Цифрлық архив"},
    {"url": "/gallery", "label": "Фотогалерея"},
    {"url": "/oral-history", "label": "Ауызша тарих"},
    {"url": "/excursion", "label": "Виртуалды экскурсия"},
    {"url": "/research", "label": "Зерттеу"},
    {"url": "/sources", "label": "Дереккөздер"},
]

# Ортақ деректер кэші (барлық бет бір JSON жазбасына сүйенеді — қайталану жоқ)
def load_data(name):
    with open(os.path.join(DATA_DIR, name), encoding="utf-8") as f:
        return json.load(f)


@app.context_processor
def inject_globals():
    return {
        "nav_items": NAV_ITEMS,
        "site_subtitle": "«Машырық қажыдан бүгінгі Ақшұқырға дейін»",
    }


# ----------------------------- Беттер -----------------------------

@app.route("/")
def index():
    history = load_data("history.json")
    people = load_data("people.json")
    return render_template(
        "index.html",
        stats=history["stats"],
        timeline_preview=history["timeline"][:3],
        people=[p for p in people["people"] if not p.get("placeholder")][:2],
    )


@app.route("/history")
def history():
    return render_template("history.html", timeline=load_data("history.json")["timeline"])


@app.route("/people")
def people():
    return render_template("people.html", people=load_data("people.json")["people"])


@app.route("/people/<person_id>")
def person(person_id):
    person_obj = next(
        (p for p in load_data("people.json")["people"] if p["id"] == person_id), None
    )
    if person_obj is None or person_obj.get("placeholder"):
        abort(404)
    return render_template(
        "person.html",
        person=person_obj,
        places=load_data("places.json")["places"],
        sources=load_data("sources.json")["sources"],
    )


@app.route("/mashyryq")
def mashyryq():
    obj = next((p for p in load_data("people.json")["people"] if p["id"] == "mashyryq-qajy"), None)
    return render_template("mashyryq.html", person=obj)


@app.route("/time-machine")
def time_machine():
    data = load_data("time_machine.json")
    return render_template("time_machine.html", intro=data["intro"], timeline=data["timeline"])


@app.route("/map")
def map_page():
    return render_template("map.html")


@app.route("/places/<place_id>")
def place_detail(place_id):
    place = next((p for p in load_data("places.json")["places"] if p["id"] == place_id), None)
    if place is None:
        abort(404)
    return render_template(
        "place.html", place=place, sources=load_data("sources.json")["sources"]
    )


@app.route("/treasures")
def treasures():
    return render_template("treasures.html", treasures=load_data("treasures.json")["treasures"])


@app.route("/gallery")
def gallery():
    return render_template("gallery.html", gallery=load_data("gallery.json"))


@app.route("/reconstruction")
def reconstruction():
    return render_template("reconstruction.html")


@app.route("/school")
def school():
    data = load_data("school.json")
    return render_template("school.html", timeline=data["timeline"], intro=data["intro"])


@app.route("/archive")
def archive():
    return render_template("archive.html", categories=load_data("archive.json")["categories"])


@app.route("/oral-history")
def oral_history():
    data = load_data("interviews.json")
    return render_template(
        "oral-history.html", interviews=data["interviews"], legends=data.get("legends", [])
    )


@app.route("/excursion")
def excursion():
    return render_template(
        "excursion.html",
        stops=load_data("history.json")["excursion"],
        places=load_data("places.json")["places"],
    )


@app.route("/research")
def research():
    return render_template("research.html")


@app.route("/sources")
def sources():
    return render_template("sources.html", sources=load_data("sources.json")["sources"])


# ----------------------------- API -----------------------------

@app.route("/api/places")
def api_places():
    return jsonify(load_data("places.json"))


@app.route("/api/history")
def api_history():
    return jsonify(load_data("history.json"))


@app.route("/api/people")
def api_people():
    return jsonify(load_data("people.json"))


@app.route("/api/time-machine")
def api_time_machine():
    return jsonify(load_data("time_machine.json"))


@app.route("/api/school")
def api_school():
    return jsonify(load_data("school.json"))


@app.route("/api/archive")
def api_archive():
    return jsonify(load_data("archive.json"))


@app.route("/api/treasures")
def api_treasures():
    return jsonify(load_data("treasures.json"))


@app.errorhandler(404)
def page_not_found(_e):
    return render_template("404.html"), 404


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
