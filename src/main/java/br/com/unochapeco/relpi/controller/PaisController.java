package br.com.unochapeco.relpi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.unochapeco.model.entities.Pais;

@RestController
@RequestMapping("/pais")
public class PaisController {

    @GetMapping
    public ResponseEntity<Pais> findAll() {
    	Pais pais = new Pais(1, "Brasil");
        return ResponseEntity.ok().body(pais);
    }
}