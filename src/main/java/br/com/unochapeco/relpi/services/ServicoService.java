package br.com.unochapeco.relpi.services;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.unochapeco.model.dao.ServicoDao;
import br.com.unochapeco.model.dao.ServicoDaoFactory;
import br.com.unochapeco.model.entities.Servico;

@RestController
@RequestMapping("/servico")
public class ServicoService {

	ServicoDao service = ServicoDaoFactory.createServicoDao();
	
	@GetMapping
    public ResponseEntity<List<Servico>> findAll() {
        return ResponseEntity.ok().body(service.findAll());
	}
	
//	@GetMapping(value = "/{id}")
//    public ResponseEntity<TipoServico> findById(@PathVariable Integer id){
//    	TipoServico obj = service.findById(id);
//        return ResponseEntity.ok().body(obj);
//    }
	
    @PostMapping
    public ResponseEntity<Servico> insert(@RequestBody Servico obj){
    	service.insert(obj);
        return ResponseEntity.ok().body(obj);
    }
}
