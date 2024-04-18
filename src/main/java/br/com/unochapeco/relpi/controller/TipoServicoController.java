package br.com.unochapeco.relpi.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.unochapeco.model.dao.DaoFactory;
import br.com.unochapeco.model.dao.TipoServicoDao;
import br.com.unochapeco.model.entities.TipoServico;

@RestController
@RequestMapping("/tipo_servico")
public class TipoServicoController {
	
	TipoServicoDao dao = DaoFactory.createTipoServicoDao();
	
    @GetMapping
    public ResponseEntity<List<TipoServico>> findAll() {
        return ResponseEntity.ok().body(dao.findAll());
	}
}