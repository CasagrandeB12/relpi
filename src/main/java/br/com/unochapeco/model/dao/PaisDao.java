package br.com.unochapeco.model.dao;

import java.util.List;

import br.com.unochapeco.model.entities.Pais;

public interface PaisDao {

	void insert(Pais obj);
	void update(Pais obj);
	void deleteById(Integer id);
	Pais findById(Integer id);
	List<Pais> findAll();
}