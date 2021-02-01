from flask import Blueprint, render_template, g, request, session

from project import db, app
from project.authorization import auth
from project.models import Collections

import requests
import json

main = Blueprint('search', __name__, template_folder='templates')

@main.route('/search', methods=["GET", "POST"])
@auth.login_required
def search():

    """Proxy Endpoint to receive price data for a stock in a date range"""

    ticker = request.args.get('stock-ticker')
    date_from = request.args.get('date-from')
    date_to = request.args.get('date-to')
    breakdown = request.args.get('breakdown')

    if ticker is None:
        return render_template('search.html')

    stock_data = requests.get('https://api.polygon.io/v2/aggs/ticker/{ticker}/range/1/{breakdown}/{date_from}/{date_to}?unadjusted=true&sort=asc&limit=120&apiKey=k9Og20q7A8c_seMsFQUqdiMc5kHgdDpd'.format(ticker=ticker, breakdown=breakdown,date_from=date_from,date_to=date_to))
    res_data = stock_data.json()
    if res_data['status'] == 'NOT_FOUND' or res_data['resultsCount'] == 0:
        return {'status': 'error', 'error_message': 'Invalid request, this is due to an invalid symbol or an invalid date(weekend or holiday)'}
    
    stock_name = requests.get('https://api.polygon.io/v2/reference/tickers?sort=ticker&search={ticker}&perpage=50&page=1&apiKey=k9Og20q7A8c_seMsFQUqdiMc5kHgdDpd'.format(ticker=ticker))
    stock_name_json = stock_name.json()

    if stock_name_json['status'] == 'OK':
        res_data['stock_name'] = stock_name_json['tickers'][0]['name']
        
    return res_data

@main.route('/save_collection', methods=["POST"])
@auth.login_required
def save():

    """Save a given stock to DB"""

    json_data = request.get_json()
    try:
        curr_collection = Collections(session['user_id'],json.dumps(json_data))
        db.session.add(curr_collection)
        db.session.commit()
        return {'status': 'success', 'message':'successfully added'}
    except:
        return 'DB error'

@main.route('/collections', methods=["GET"])
@auth.login_required
def profile():

    """Get all graphs that are associated with current user"""

    if request.method == "GET":
        user_graphs = Collections.query.filter_by(user_id = session['user_id']).all()
        graph_lst = []
        for i in user_graphs:
            graph_obj = json.loads(i.graph_data)
            graph_obj["id"] = i.id
            graph_lst.append(graph_obj)

        graph_lst = json.dumps(graph_lst)
        return render_template('collections.html', graphs=graph_lst)

@main.route('/delete_graph', methods=["POST"])
@auth.login_required
def delete():

    """Delete passed in graph from users collection"""

    try:
        collection = request.get_json()['user_id']
        Collections.query.filter_by(id=collection).delete()
        db.session.commit()
        return {"status": "success", "deleted": str(request.get_json()['user_id'])}
    except:
        return 'DB error'