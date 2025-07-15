package com.example.demo.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.AssertTrue;

import java.io.Serializable;

public record CustomerDto(
        @NotBlank
        @Size(max = 32)
        String customerCode,

        @NotBlank
        @Size(max = 255)
        String customerName,

        @NotNull
        Boolean isOrganization,

        @NotNull
        Boolean isPerson,

        @Size(max = 12)
        @Pattern(regexp = "\\d{10}|\\d{12}", message = "ИНН должен содержать 10 или 12 цифр")
        String customerInn,

        @Size(max = 9)
        //@Pattern(regexp = "\\d{9}", message = "КПП должен содержать 9 цифр")
        @Nullable
        String customerKpp,

        @Size(max = 255)
        String customerLegalAddress,

        @Size(max = 255)
        String customerPostalAddress,

        @Email
        @Size(max = 255)
        String customerEmail,

        @Size(max = 32)
        String customerCodeMain
) implements Serializable {
    @AssertTrue(message = "Может быть указан или isOrganization или isPerson (но не оба)")
    private boolean isExactlyOneRole() {
        return Boolean.TRUE.equals(isOrganization) ^ Boolean.TRUE.equals(isPerson);
    }
}

