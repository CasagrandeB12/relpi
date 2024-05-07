package br.com.unochapeco.relpi.services;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.unochapeco.model.dao.PaisDao;
import br.com.unochapeco.model.dao.PaisDaoFactory;
import br.com.unochapeco.model.entities.Pais;

@RestController
@RequestMapping("/pais")
public class PaisService {

	PaisDao service = PaisDaoFactory.createPaisDao();
	
	@GetMapping
	public ResponseEntity<List<Pais>> findAll(){
		return ResponseEntity.ok().body(service.findAll());
	}
	
	@GetMapping(value = "/{id}")
	public ResponseEntity<Pais> findById(@PathVariable Integer id){
		return ResponseEntity.ok().body(service.findById(id));
	}
	
	@PostMapping("/novo")
	public ResponseEntity<Pais> insert(@RequestBody Pais obj){
		service.insert(obj);
		return ResponseEntity.ok().body(obj);
	}
}
