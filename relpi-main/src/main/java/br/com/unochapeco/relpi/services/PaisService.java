package br.com.unochapeco.relpi.services;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.unochapeco.model.dao.PaisDao;
import br.com.unochapeco.model.dao.PaisDaoFactory;
import br.com.unochapeco.model.entities.Pais;

@RestController
@RequestMapping("/pais")
public class PaisService {

	PaisDao pais = PaisDaoFactory.createPaisDao();
	
	@GetMapping
	public ResponseEntity<List<Pais>> findAll(){
		return ResponseEntity.ok().body(pais.findAll());
	}
}
