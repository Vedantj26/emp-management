package com.example.employee.security;

import org.springframework.stereotype.Component;

@Component
public class AESUtilHolder {

    private static AESUtil aesUtil;

    public AESUtilHolder(AESUtil aesUtil) {
        AESUtilHolder.aesUtil = aesUtil;
    }

    public static AESUtil get() {
        return aesUtil;
    }
}
