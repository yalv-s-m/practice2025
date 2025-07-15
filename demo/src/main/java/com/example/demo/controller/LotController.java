package com.example.demo.controller;

import com.example.demo.dto.LotDto;
import com.example.demo.service.LotService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lots")
public class LotController {

    private final LotService service;

    public LotController(LotService service) {
        this.service = service;
    }

    @GetMapping
    public List<LotDto> list() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public LotDto one(@PathVariable long id) {
        return service.find(id);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public LotDto create(@Valid @RequestBody LotDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public LotDto update(@PathVariable long id,
                         @Valid @RequestBody LotDto dto) {
        return service.update(id, dto);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {
        service.delete(id);
    }
}

