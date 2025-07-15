package com.example.demo.controller;

import com.example.demo.dto.CustomerDto;
import com.example.demo.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    /* GET /api/customers */
    @GetMapping
    public List<CustomerDto> list() {
        return service.findAll();
    }

    /* GET /api/customers/{code} */
    @GetMapping("/{code}")
    public CustomerDto one(@PathVariable String code) {
        return service.find(code);          // 200 / null => 204
    }

    /* POST /api/customers */
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public CustomerDto create(@Valid @RequestBody CustomerDto dto) {
        return service.create(dto);
    }

    /* PUT /api/customers/{code} */
    @PutMapping("/{code}")
    public CustomerDto update(@PathVariable String code,
                              @Valid @RequestBody CustomerDto dto) {
        return service.update(code, dto);
    }

    /* DELETE /api/customers/{code} */
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{code}")
    public void delete(@PathVariable String code) {
        service.delete(code);
    }
}


