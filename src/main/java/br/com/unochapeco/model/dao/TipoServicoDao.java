package br.com.unochapeco.model.dao;

import java.util.List;

import br.com.unochapeco.model.entities.TipoServico;

public interface TipoServicoDao {

	void insert(TipoServico obj);
	void update(TipoServico obj, Integer id);
	void deleteById(Integer id);
	TipoServico findById(Integer id);
	List<TipoServico> findAll();
}