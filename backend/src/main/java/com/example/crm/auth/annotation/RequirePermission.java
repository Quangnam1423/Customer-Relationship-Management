package com.example.crm.auth.annotation;

import com.example.crm.user.model.ERole;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequirePermission {
    ERole value() default ERole.ROLE_USER;
    int level() default 0;
}
