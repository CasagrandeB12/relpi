package br.com.unochapeco.model.dao;

import java.util.List;

import br.com.unochapeco.model.entities.Pessoas;

public interface PessoasDao {

	void insert (Pessoas obj);
	void update (Pessoas obj, Integer id);
	void deleteById (Integer id);
	Pessoas findById (Integer id);
	List<Pessoas> findAll();
}
