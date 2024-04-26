package br.com.unochapeco.relpi.resources;

import java.sql.Connection;
import java.util.List;

import br.com.unochapeco.model.dao.ProfissionalDao;
import br.com.unochapeco.model.entities.Profissional;

public class ProfissionalJDBC implements ProfissionalDao {

	private Connection conn;
	
	public ProfissionalJDBC(Connection conn) {
		this.conn = conn;
	}
	
	@Override
	public void insert(Profissional obj) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void update(Profissional obj, Integer id) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void deleteById(Integer id) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public Profissional findById(Integer id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Profissional> findAll() {
		// TODO Auto-generated method stub
		return null;
	}

}
