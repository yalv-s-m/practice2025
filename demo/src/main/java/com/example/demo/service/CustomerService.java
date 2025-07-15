package com.example.demo.service;

import com.example.demo.dto.CustomerDto;
import com.example.demo.exception.NotFoundException;
import jooqdata.tables.records.CustomerRecord;
import org.jooq.DSLContext;
import org.jooq.exception.DataAccessException;
import org.springframework.web.server.ResponseStatusException;
import static org.springframework.http.HttpStatus.CONFLICT;

import java.util.List;
import java.util.stream.Collectors;

import static jooqdata.tables.Customer.CUSTOMER;

public class CustomerService {

    private final DSLContext dsl;

    public CustomerService(DSLContext dsl) {
        this.dsl = dsl;
    }

    /* READ-all */
    public List<CustomerDto> findAll() {
        return dsl.selectFrom(CUSTOMER)
                .fetchInto(CustomerRecord.class)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /* READ-one */
    public CustomerDto find(String code) {
        CustomerRecord rec = dsl.fetchOne(CUSTOMER, CUSTOMER.CUSTOMER_CODE.eq(code));
        if (rec == null)
            throw new NotFoundException("Customer " + code + " not found");
        return toDto(rec);
    }

    /* CREATE */
    public CustomerDto create(CustomerDto dto) {
        CustomerRecord rec = dsl.newRecord(CUSTOMER);
        fromDto(rec, dto);
        storeSafely(rec);
        return toDto(rec);
    }

    /* UPDATE (PUT) */
    public CustomerDto update(String code, CustomerDto dto) {
        CustomerRecord rec = dsl.fetchOne(CUSTOMER, CUSTOMER.CUSTOMER_CODE.eq(code));
        if (rec == null)
            throw new NotFoundException("Customer " + code + " not found");
        fromDto(rec, dto);
        storeSafely(rec);
        return toDto(rec);
    }

    /* DELETE */
    public void delete(String code) throws DataAccessException {
        dsl.deleteFrom(CUSTOMER)
                .where(CUSTOMER.CUSTOMER_CODE.eq(code))
                .execute();
    }

    /* для PK/FK/CHECK ошибок */
    private void storeSafely(CustomerRecord rec) {
        try {
            rec.store();                        // INSERT/UPDATE
        } catch (DataAccessException ex) {
            // 23505 = duplicate key, 23503 = FK violation, 23514 = check violation
            String state = ex.sqlState();
            if ("23505".equals(state) || "23503".equals(state) || "23514".equals(state))
                throw new ResponseStatusException(CONFLICT, ex.getMessage(), ex);
            throw ex; // остальные ошибки как 500
        }
    }

    /* маппинг */
    private CustomerDto toDto(CustomerRecord r) {
        return new CustomerDto(
                r.getCustomerCode(),
                r.getCustomerName(),
                r.getIsOrganization(),
                r.getIsPerson(),
                r.getCustomerInn(),
                r.getCustomerKpp(),
                r.getCustomerLegalAddress(),
                r.getCustomerPostalAddress(),
                r.getCustomerEmail(),
                r.getCustomerCodeMain()
        );
    }

    private void fromDto(CustomerRecord r, CustomerDto d) {
        r.setCustomerCode(d.customerCode());
        r.setCustomerName(d.customerName());
        r.setIsOrganization(d.isOrganization());
        r.setIsPerson(d.isPerson());
        r.setCustomerInn(d.customerInn());
        r.setCustomerKpp(d.customerKpp());
        r.setCustomerLegalAddress(d.customerLegalAddress());
        r.setCustomerPostalAddress(d.customerPostalAddress());
        r.setCustomerEmail(d.customerEmail());
        r.setCustomerCodeMain(d.customerCodeMain());
    }
}

