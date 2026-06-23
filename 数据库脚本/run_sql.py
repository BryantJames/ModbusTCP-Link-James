import os
import sys
import pymysql
from pymysql.constants import CLIENT

def run_sql_file(host, port, user, password, database, file_path):
    print(f"\n[执行] {file_path}")
    print(f"[连接] {user}@{host}:{port}/{database if database else '(none)'}")

    with open(file_path, 'r', encoding='utf-8') as f:
        sql = f.read()

    conn_kwargs = {
        'host': host,
        'port': port,
        'user': user,
        'password': password,
        'charset': 'utf8mb4',
        'client_flag': CLIENT.MULTI_STATEMENTS,
        'autocommit': False
    }
    if database:
        conn_kwargs['database'] = database

    conn = None
    try:
        conn = pymysql.connect(**conn_kwargs)
        cursor = conn.cursor()
        cursor.execute(sql)

        # 消耗所有结果集（多语句执行会有多个 result set）
        while cursor.nextset():
            pass

        conn.commit()
        print(f"[成功] {file_path} 执行完成")
        return True
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"[失败] {file_path} 执行出错: {e}")
        return False
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    host = os.environ.get('DB_HOST', '120.79.56.98')
    port = int(os.environ.get('DB_PORT', '3306'))
    user = os.environ.get('DB_USER', 'james')
    password = os.environ.get('DB_PASSWORD', '')
    database = os.environ.get('DB_NAME', 'modbus_tcp_controller')

    base_dir = os.path.dirname(os.path.abspath(__file__))
    files = [
        os.path.join(base_dir, '01_schema.sql'),
        os.path.join(base_dir, '02_init_data.sql'),
    ]

    all_ok = True
    for idx, file_path in enumerate(files):
        if not os.path.exists(file_path):
            print(f"[跳过] 文件不存在: {file_path}")
            all_ok = False
            continue
        # schema 文件自己包含 CREATE DATABASE + USE，先不指定数据库
        db_for_file = '' if idx == 0 else database
        ok = run_sql_file(host, port, user, password, db_for_file, file_path)
        if not ok:
            all_ok = False

    sys.exit(0 if all_ok else 1)
