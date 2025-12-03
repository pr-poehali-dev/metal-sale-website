import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get catalog categories and price list from database
    Args: event - dict with httpMethod
          context - object with request metadata
    Returns: HTTP response with catalog data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute('''
        SELECT id, name, icon, description, sort_order 
        FROM categories 
        WHERE is_active = true 
        ORDER BY sort_order
    ''')
    categories = cursor.fetchall()
    
    cursor.execute('''
        SELECT id, category_id, name, specs, price, unit, sort_order 
        FROM price_list 
        WHERE is_active = true 
        ORDER BY sort_order
    ''')
    price_list = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    result = {
        'categories': [dict(cat) for cat in categories],
        'priceList': [dict(item) for item in price_list]
    }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(result, default=str),
        'isBase64Encoded': False
    }
