package hr.unizg.fer.backend.backend.dao;

import hr.unizg.fer.backend.backend.domain.Projekt;
import hr.unizg.fer.backend.backend.domain.Vjestina;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

public class ProjektSpecification {
    public static Specification<Projekt> hasNaziv(String naziv) {
        return (root, query, cb) -> naziv == null ? null :
                cb.like(cb.lower(root.get("naziv")), "%" + naziv.toLowerCase() + "%");
    }

    public static Specification<Projekt> hasBudzet(BigDecimal budzet) {
        return (root, query, cb) -> budzet == null ? null :
                cb.greaterThan(root.get("budzet"), budzet);
    }

    public static Specification<Projekt> hasRokIzrade(LocalDate rokIzrade) {
        return (root, query, cb) -> rokIzrade == null ? null :
                cb.greaterThan(root.get("rokIzrade"), rokIzrade);
    }

    public static Specification<Projekt> hasVjestine(Set<Vjestina> vjestine) {
        return (root, query, cb) -> {
            if (vjestine == null || vjestine.isEmpty()) return null;
            var join = root.joinSet("vjestine");
            if (query != null) {
                query.groupBy(root.get("id"));
                query.having(cb.equal(cb.countDistinct(join), vjestine.size()));
            }
            return join.in(vjestine);
        };
    }

    public static Specification<Projekt> isOtvoren() {
        return (root, query, cb) -> cb.equal(root.get("status"), "otvoren");
    }

    public static Specification<Projekt> notNarucitelj(String email) {
        return (root, query, cb) -> email == null ? null :
                cb.notEqual(root.get("narucitelj").get("email"), email);
    }
}