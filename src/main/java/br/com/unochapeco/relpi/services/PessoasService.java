package br.com.unochapeco.relpi.services;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.unochapeco.model.dao.PessoasDao;
import br.com.unochapeco.model.dao.PessoasDaoFactory;
import br.com.unochapeco.model.entities.Pessoas;

@RestController
@CrossOrigin("*")
@RequestMapping("/pessoas")
public class PessoasService {

	PessoasDao service = PessoasDaoFactory.createPessoasDao();
	
	@GetMapping("/todos")
    public ResponseEntity<List<Pessoas>> findAll() {
        return ResponseEntity.ok().body(service.findAll());
	}
	
	@PostMapping("/novo")
	public ResponseEntity<Pessoas> insert (@RequestBody Pessoas obj){
		service.insert(obj);
		return ResponseEntity.ok().body(obj);
	}
	
	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Pessoas> deleteByID (@PathVariable Integer id){
		service.deleteById(id);
		return ResponseEntity.noContent().build();
	}
	
	@PutMapping(value = "/{id}")
	public ResponseEntity<Pessoas> update(@RequestBody Pessoas obj, @PathVariable Integer id){
		service.update(obj, id);
		return ResponseEntity.ok().body(obj);
	}
}
