package com.james.modbustcp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Modbus TCP 控制站 Java 后端启动类
 */
@EnableScheduling
@SpringBootApplication
public class ModbusTcpApplication {

    public static void main(String[] args) {
        SpringApplication.run(ModbusTcpApplication.class, args);
    }

}
