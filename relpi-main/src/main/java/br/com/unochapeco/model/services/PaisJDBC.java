package br.com.unochapeco.model.services;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import br.com.unochapeco.model.dao.PaisDao;
import br.com.unochapeco.model.entities.Pais;
import br.com.unochapeco.relpi.controller.db.DbException;

public class PaisJDBC implements PaisDao{

	private Connection conn;
	
	public PaisJDBC(Connection conn) {
		this.conn = conn;
	}

	@Override
	public void insert(Pais obj) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void update(Pais obj, Integer id) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void deleteById(Integer id) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public Pais findById(Integer id) {
		PreparedStatement st = null;
		ResultSet rs = null;
		try {
			st = conn.prepareStatement(
					"SELECT p.PAIS_ID ,p.NOME"
					+ " FROM pais p"
					+ " WHERE p.PAIS_ID = ?");
			
			st.setInt(1, id);
			rs = st.executeQuery();
		
			if(rs.next()) {
				Pais obj = instatiatePais(rs); 
				return obj;
			}
			return null;
		}catch(SQLException e) {
			throw new DbException(e.getMessage());
		}
	}

	@Override
	public List<Pais> findAll() {
		PreparedStatement st = null;
		ResultSet rs = null;
		try {
			st = conn.prepareStatement("SELECT * FROM pais");
			rs = st.executeQuery();
			
			List<Pais> list = new ArrayList<>();
			
			while(rs.next()) {
				Pais obj = instatiatePais(rs);
				list.add(obj);
			}
			return list;
		}catch(SQLException e) {
			throw new DbException(e.getMessage());
		}
	}

	private Pais instatiatePais(ResultSet rs) throws SQLException {
		Pais pais = new Pais();
		pais.setId(rs.getInt("pais_id"));
		pais.setNome(rs.getString("nome"));
		
		return pais;
	}

}
