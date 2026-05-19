import mysql.connector
from mysql.connector import errorcode

SCHEMA_FILE = 'database/support_dashboard.sql'

config = {
    'user': 'root',
    'password': '',
    'host': '127.0.0.1',
    'raise_on_warnings': True,
    'use_pure': True
}

try:
    with open(SCHEMA_FILE, 'r', encoding='utf-8') as f:
        sql = f.read()

    connection = mysql.connector.connect(**config)
    cursor = connection.cursor()
    for statement in sql.split(';'):
        statement = statement.strip()
        if statement:
            cursor.execute(statement)
    connection.commit()
    print('Database schema imported successfully.')
except FileNotFoundError:
    print(f'Unable to locate schema file: {SCHEMA_FILE}')
except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print('Access denied: check MySQL username and password.')
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print('Database does not exist and could not be created.')
    else:
        print(err)
finally:
    try:
        cursor.close()
        connection.close()
    except NameError:
        pass
