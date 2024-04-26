package br.com.unochapeco.model.dao;

import java.util.List;

import br.com.unochapeco.model.entities.Profissional;

public interface ProfissionalDao {

	void insert(Profissional obj);
	void update(Profissional obj, Integer id);
	void deleteById(Integer id);
	Profissional findById(Integer id);
	List<Profissional> findAll();
}
