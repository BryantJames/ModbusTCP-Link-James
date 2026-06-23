# Modbus TCP Java 后端

基于 Spring Boot 3 + MyBatis-Plus + Modbus4J 的 Modbus TCP 控制站 Java 后端服务，提供 REST API 与 WebSocket 实时数据推送。

## 技术栈

| 技术 | 版本/说明 |
|------|----------|
| JDK | 21 |
| Spring Boot | 3.3.0 |
| MyBatis-Plus | 3.5.7 |
| Modbus4J | 3.0.5 |
| MySQL | 8.0+ |
| JWT | jjwt 0.12.6 |
| Maven | 3.9+ |

## 项目结构

```
Java后端代码/
├── pom.xml
├── README.md
└── src/
    ├── main/
    │   ├── java/com/james/modbustcp/
    │   │   ├── ModbusTcpApplication.java
    │   │   ├── config/          # 配置类
    │   │   ├── controller/      # REST API
    │   │   ├── dto/             # 请求 DTO
    │   │   ├── entity/          # 数据库实体
    │   │   ├── mapper/          # MyBatis Mapper
    │   │   ├── service/         # Service 接口
    │   │   ├── service/impl/    # Service 实现
    │   │   ├── modbus/          # Modbus 连接管理与轮询
    │   │   ├── websocket/       # WebSocket 处理器
    │   │   ├── security/        # JWT 工具与过滤器
    │   │   ├── exception/       # 全局异常处理
    │   │   ├── vo/              # 响应 VO
    │   │   └── util/            # 工具类
    │   └── resources/
    │       ├── application.yml
    │       ├── application-dev.yml
    │       └── mapper/          # XML Mapper
    └── test/
```

## 快速启动（无需 MySQL）

如果你还没有准备 MySQL，可以使用内置的 H2 内存数据库快速启动并验证项目骨架：

```bash
mvn clean package -DskipTests
java -jar -Dspring.profiles.active=local target/modbus-tcp-java-backend-1.0.0-SNAPSHOT.jar
```

然后访问 `http://localhost:8080/api/health`，使用 `admin` / `admin123` 登录验证。

**注意**：local profile 仅用于本地快速验证，不包含 Modbus 轮询和 MySQL 分区表功能。

## 数据库准备（生产/开发环境）

1. 确保 MySQL 已启动。
2. 执行项目根目录下的数据库脚本：

```bash
mysql -u root -p < ../数据库脚本/01_schema.sql
mysql -u root -p < ../数据库脚本/02_init_data.sql
```

默认会创建 `modbus_tcp_controller` 数据库，并初始化管理员账号：
- 用户名：`admin`
- 密码：`admin123`

## 配置

编辑 `src/main/resources/application-dev.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/modbus_tcp_controller?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    password: 你的密码

jwt:
  secret: 你的 JWT 密钥（生产环境必须修改）
```

## 编译与运行

```bash
# 编译
mvn clean compile -DskipTests

# 打包
mvn clean package -DskipTests

# 运行
mvn spring-boot:run
```

服务默认运行在 `http://localhost:8080`。

## API 列表

统一返回格式：

```json
{
  "success": true,
  "message": "操作成功",
  "data": {},
  "timestamp": "2026-06-23T14:00:00"
}
```

### 公开接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| POST | `/api/auth/register` | 用户注册 |
| POST | `/api/auth/login` | 用户登录 |

### 需登录接口

在请求头中携带：`Authorization: Bearer <token>`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/auth/me` | 获取当前用户信息 |
| POST | `/api/auth/logout` | 登出 |
| POST | `/api/auth/avatar` | 更新头像 |
| GET | `/api/devices` | 设备列表 |
| POST | `/api/devices` | 新增设备 |
| PUT | `/api/devices/{id}` | 更新设备 |
| DELETE | `/api/devices/{id}` | 删除设备 |
| POST | `/api/devices/{id}/connect` | 连接设备 |
| POST | `/api/devices/{id}/disconnect` | 断开设备 |
| GET | `/api/devices/{deviceId}/registers` | 寄存器列表 |
| POST | `/api/devices/{deviceId}/registers` | 新增寄存器 |
| PUT | `/api/devices/{deviceId}/registers/{id}` | 更新寄存器 |
| DELETE | `/api/devices/{deviceId}/registers/{id}` | 删除寄存器 |
| GET | `/api/monitor/devices/{deviceId}/registers` | 最新监控数据 |
| POST | `/api/modbus/read` | 单次读取调试 |
| POST | `/api/modbus/write` | 单次写入调试 |
| GET | `/api/history` | 历史数据查询 |
| GET | `/api/alarms` | 报警列表 |
| GET | `/api/alarms/pending` | 未处理报警 |
| PUT | `/api/alarms/{id}/confirm` | 确认报警 |
| GET | `/api/settings` | 系统设置列表 |
| GET | `/api/settings/{key}` | 根据 key 查设置 |
| PUT | `/api/settings/{key}` | 更新设置 |

## WebSocket 实时推送

连接地址：`ws://localhost:8080/ws/realtime`

轮询服务会定时读取所有启用监控的寄存器，并将最新数据广播给所有 WebSocket 客户端。

## 快速验证

```bash
# 1. 健康检查
curl http://localhost:8080/api/health

# 2. 登录获取 token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 3. 使用 token 查询设备列表
curl http://localhost:8080/api/devices \
  -H "Authorization: Bearer <token>"
```

## 注意事项

1. 首次启动前必须确保 MySQL 数据库已创建并执行初始化脚本。
2. 生产环境请修改 `jwt.secret`，避免使用默认密钥。
3. Modbus 轮询默认 1000ms 一次，可在 `application-dev.yml` 中调整。
4. 头像字段使用 Base64 字符串存储，建议限制大小。

## 后续扩展

- [ ] 操作日志切面记录 `sys_operation_log`
- [ ] 系统设置缓存与热更新
- [ ] Modbus 批量读写线圈/寄存器
- [ ] 历史数据归档任务
- [ ] Docker 部署支持
