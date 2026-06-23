import pymysql

conn = pymysql.connect(
    host='120.79.56.98',
    port=3306,
    user='james',
    password='James520!@#',
    database='modbus_tcp_controller',
    charset='utf8mb4'
)
cur = conn.cursor()

print('=== 表列表 ===')
cur.execute('SHOW TABLES')
tables = [row[0] for row in cur.fetchall()]
print(tables)

print('\n=== 各表记录数 ===')
for t in tables:
    cur.execute('SELECT COUNT(*) FROM `%s`' % t)
    print(f'{t}: {cur.fetchone()[0]} rows')

print('\n=== 默认设备 ===')
cur.execute('SELECT id, device_name, host, port, unit_id FROM mb_device LIMIT 1')
print(cur.fetchone())

print('\n=== 监控寄存器 ===')
cur.execute('SELECT register_address, register_name, unit FROM mb_register WHERE is_monitored=1 ORDER BY display_order')
for row in cur.fetchall():
    print(row)

print('\n=== 系统设置 ===')
cur.execute('SELECT config_key, config_value FROM sys_setting LIMIT 5')
for row in cur.fetchall():
    print(row)

conn.close()
print('\n数据库验证完成')
