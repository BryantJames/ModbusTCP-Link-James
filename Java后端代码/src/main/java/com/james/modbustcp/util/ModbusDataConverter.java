package com.james.modbustcp.util;

import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

/**
 * Modbus 数据转换工具
 */
@Slf4j
public class ModbusDataConverter {

    /**
     * 将 Modbus 原始 short 数组转换为工程值
     *
     * @param data       原始 short 数据
     * @param dataType   数据类型：UINT16/INT16/UINT32/INT32/FLOAT32/FLOAT64/BIT
     * @param scale      缩放系数
     * @param offset     偏移量
     * @param bitIndex   位索引（仅 BIT 类型有效）
     * @return 工程值
     */
    public static BigDecimal convert(short[] data, String dataType,
                                     BigDecimal scale, BigDecimal offset, Integer bitIndex) {
        if (data == null || data.length == 0) {
            return null;
        }

        BigDecimal rawValue;
        switch (dataType.toUpperCase()) {
            case "UINT16":
                rawValue = BigDecimal.valueOf(data[0] & 0xFFFFL);
                break;
            case "INT16":
                rawValue = BigDecimal.valueOf(data[0]);
                break;
            case "UINT32":
                if (data.length < 2) {
                    return null;
                }
                rawValue = BigDecimal.valueOf(((data[0] & 0xFFFFL) << 16) | (data[1] & 0xFFFFL));
                break;
            case "INT32":
                if (data.length < 2) {
                    return null;
                }
                rawValue = BigDecimal.valueOf((data[0] << 16) | (data[1] & 0xFFFF));
                break;
            case "FLOAT32":
                if (data.length < 2) {
                    return null;
                }
                byte[] floatBytes = shortsToBytes(data, 2, ByteOrder.BIG_ENDIAN);
                rawValue = BigDecimal.valueOf(ByteBuffer.wrap(floatBytes).getFloat());
                break;
            case "FLOAT64":
                if (data.length < 4) {
                    return null;
                }
                byte[] doubleBytes = shortsToBytes(data, 4, ByteOrder.BIG_ENDIAN);
                rawValue = BigDecimal.valueOf(ByteBuffer.wrap(doubleBytes).getDouble());
                break;
            case "BIT":
                int idx = bitIndex != null ? bitIndex : 0;
                int bit = (data[0] >> idx) & 0x1;
                rawValue = BigDecimal.valueOf(bit);
                break;
            default:
                log.warn("未知的数据类型: {}", dataType);
                rawValue = BigDecimal.valueOf(data[0] & 0xFFFFL);
        }

        if (scale != null) {
            rawValue = rawValue.multiply(scale);
        }
        if (offset != null) {
            rawValue = rawValue.add(offset);
        }
        return rawValue;
    }

    /**
     * 将工程值转换为 short 数组，用于写入寄存器
     */
    public static short[] toShortArray(BigDecimal value, String dataType) {
        switch (dataType.toUpperCase()) {
            case "UINT16":
            case "INT16":
                return new short[]{value.shortValue()};
            case "UINT32":
            case "INT32":
                long longVal = value.longValue();
                return new short[]{(short) (longVal >> 16), (short) (longVal & 0xFFFF)};
            case "FLOAT32":
                byte[] floatBytes = ByteBuffer.allocate(4).putFloat(value.floatValue()).array();
                return bytesToShorts(floatBytes, ByteOrder.BIG_ENDIAN);
            case "FLOAT64":
                byte[] doubleBytes = ByteBuffer.allocate(8).putDouble(value.doubleValue()).array();
                return bytesToShorts(doubleBytes, ByteOrder.BIG_ENDIAN);
            default:
                return new short[]{value.shortValue()};
        }
    }

    /**
     * short 数组转字节数组
     */
    private static byte[] shortsToBytes(short[] shorts, int length, ByteOrder order) {
        byte[] bytes = new byte[length * 2];
        ByteBuffer buffer = ByteBuffer.wrap(bytes).order(order);
        for (int i = 0; i < length; i++) {
            buffer.putShort(shorts[i]);
        }
        return bytes;
    }

    /**
     * 字节数组转 short 数组
     */
    private static short[] bytesToShorts(byte[] bytes, ByteOrder order) {
        ByteBuffer buffer = ByteBuffer.wrap(bytes).order(order);
        short[] shorts = new short[bytes.length / 2];
        for (int i = 0; i < shorts.length; i++) {
            shorts[i] = buffer.getShort();
        }
        return shorts;
    }

}
