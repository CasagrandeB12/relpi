package br.com.unochapeco.relpi.services;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.unochapeco.model.dao.TipoServicoDaoFactory;
import br.com.unochapeco.model.dao.TipoServicoDao;
import br.com.unochapeco.model.entities.TipoServico;

@RestController
@RequestMapping("/tipo_servico")
public class TipoServicoService {
	
	TipoServicoDao service = TipoServicoDaoFactory.createTipoServicoDao();
	
    @GetMapping
    public ResponseEntity<List<TipoServico>> findAll() {
        return ResponseEntity.ok().body(service.findAll());
	}
    
    @GetMapping(value = "/{id}")
    public ResponseEntity<TipoServico> findById(@PathVariable Integer id){
    	TipoServico obj = service.findById(id);
        return ResponseEntity.ok().body(obj);
    }
    
    @PostMapping
    public ResponseEntity<TipoServico> insert(@RequestBody TipoServico obj){
    	service.insert(obj);
        return ResponseEntity.ok().body(obj);
    }
    
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Integer id){
    	service.deleteById(id);
    	return ResponseEntity.noContent().build();
    }
    
    @PutMapping(value = "/{id}")
    public ResponseEntity<TipoServico> update(@RequestBody TipoServico obj, @PathVariable Integer id){
    	service.update(obj, id);
    	return ResponseEntity.ok().body(obj);
    }
}