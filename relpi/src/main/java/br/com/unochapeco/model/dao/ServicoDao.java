package br.com.unochapeco.model.dao;

import java.util.List;

import br.com.unochapeco.model.entities.Servico;

public interface ServicoDao {

	void insert(Servico obj);
	void update(Servico obj, Integer id);
	void deleteById(Integer id);
	Servico findById(Integer id);
	List<Servico> findAll();
}
