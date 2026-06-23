package com.james.modbustcp.vo;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 统一 API 响应结果
 */
@Data
public class Result<T> {

    private Boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;

    public Result() {
        this.timestamp = LocalDateTime.now();
    }

    public static <T> Result<T> ok() {
        return ok(null);
    }

    public static <T> Result<T> ok(T data) {
        Result<T> result = new Result<>();
        result.setSuccess(true);
        result.setMessage("操作成功");
        result.setData(data);
        return result;
    }

    public static <T> Result<T> fail(String message) {
        Result<T> result = new Result<>();
        result.setSuccess(false);
        result.setMessage(message);
        return result;
    }

    public static <T> Result<T> fail(String message, T data) {
        Result<T> result = fail(message);
        result.setData(data);
        return result;
    }

}
