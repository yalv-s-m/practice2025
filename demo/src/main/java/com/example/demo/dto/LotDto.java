package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record LotDto(
        Long id,

        @NotBlank
        @Size(max = 255)
        String lotName,

        @NotBlank
        @Size(max = 32)
        String customerCode,

        @NotNull
        BigDecimal price,

        @NotBlank
        @Pattern(regexp = "RUB|USD|EUR")
        String currencyCode,

        @NotBlank
        @Pattern(regexp = "Без НДС|18%|20%")
        String ndsRate,

        @Size(max = 255)
        String placeDelivery,

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime dateDelivery
) implements Serializable {}

