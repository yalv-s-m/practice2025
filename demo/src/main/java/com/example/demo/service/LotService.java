package com.example.demo.service;

import com.example.demo.dto.LotDto;
import jooqdata.tables.records.LotRecord;
import org.jooq.DSLContext;
import org.jooq.exception.DataAccessException;
import com.example.demo.exception.NotFoundException;
import org.springframework.web.server.ResponseStatusException;
import static org.springframework.http.HttpStatus.CONFLICT;

import java.util.List;
import java.util.stream.Collectors;

import static jooqdata.tables.Lot.LOT;

public class LotService {

    private final DSLContext dsl;

    public LotService(DSLContext dsl) {
        this.dsl = dsl;
    }

    public List<LotDto> findAll() {
        return dsl.selectFrom(LOT)
                .fetchInto(LotRecord.class)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public LotDto find(long id) {
        LotRecord rec = dsl.fetchOne(LOT, LOT.ID.eq(id));
        if (rec == null)
            throw new NotFoundException("Lot " + id + " not found");
        return toDto(rec);
    }

    public LotDto create(LotDto dto) {
        LotRecord rec = dsl.newRecord(LOT);
        fromDto(rec, dto);
        storeSafely(rec);                    // INSERT; id генерируется автоматически
        return toDto(rec);
    }

    public LotDto update(long id, LotDto dto) {
        LotRecord rec = dsl.fetchOne(LOT, LOT.ID.eq(id));
        if (rec == null)
            throw new NotFoundException("Lot " + id + " not found");
        fromDto(rec, dto);
        storeSafely(rec);                    // UPDATE
        return toDto(rec);
    }

    public void delete(long id) {
        dsl.deleteFrom(LOT)
                .where(LOT.ID.eq(id))
                .execute();
    }

    private void storeSafely(LotRecord rec) {
        try {
            rec.store();
        } catch (DataAccessException ex) {
            String state = ex.sqlState();
            if ("23505".equals(state) || "23503".equals(state) || "23514".equals(state))
                throw new ResponseStatusException(CONFLICT, ex.getMessage(), ex);
            throw ex;
        }
    }

    /* --- mapping --- */
    private LotDto toDto(LotRecord r) {
        return new LotDto(
                r.getId(),
                r.getLotName(),
                r.getCustomerCode(),
                r.getPrice(),
                r.getCurrencyCode(),
                r.getNdsRate(),
                r.getPlaceDelivery(),
                r.getDateDelivery()
        );
    }

    private void fromDto(LotRecord r, LotDto d) {
        r.setLotName(d.lotName());
        r.setCustomerCode(d.customerCode());
        r.setPrice(d.price());
        r.setCurrencyCode(d.currencyCode());
        r.setNdsRate(d.ndsRate());
        r.setPlaceDelivery(d.placeDelivery());
        r.setDateDelivery(d.dateDelivery());
    }
}

