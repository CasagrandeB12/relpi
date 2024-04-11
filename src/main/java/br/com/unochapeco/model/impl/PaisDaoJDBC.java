package br.com.unochapeco.model.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import br.com.unochapeco.model.dao.PaisDao;
import br.com.unochapeco.model.entities.Pais;
import br.com.unochapeco.relpi.controller.db.DB;
import br.com.unochapeco.relpi.controller.db.DbException;

public class PaisDaoJDBC implements PaisDao {

	private Connection conn;

	public PaisDaoJDBC(Connection conn) {
		this.conn = conn;
	}

	@Override
	public void insert(Pais obj) {
		PreparedStatement st = null;
		try {
			st = conn.prepareStatement(
					"INSERT INTO pais "
					+ "(PAIS_ID, NOME) "
					+ "VALUES "
					+ "(?, ?)",
					Statement.RETURN_GENERATED_KEYS);
			
			st.setInt(1, obj.getId());
			st.setString(2, obj.getNome());
			
			int rowsAffected = st.executeUpdate();
			if(rowsAffected > 0) {
				ResultSet rs = st.getGeneratedKeys();
				if(rs.next()) {
					int id = rs.getInt(1);
					obj.setId(id);
				}
				DB.closeResultSet(null);
			}
			else {
				throw new DbException("Erro inesperado, nenhuma linha foi alterada!");
			}
		}catch(SQLException e){
			e.getMessage();
		}
		finally {
			DB.closeStatement(st);
		}
	}

	@Override
	public void update(Pais obj) {
		PreparedStatement st = null;
		try {
			st = conn.prepareStatement(
					"UPDATE PAIS " 
					+ "SET NOME = ? "
					+ "WHERE pais_id = ?",
					Statement.RETURN_GENERATED_KEYS);
			
			st.setString(1, obj.getNome());
			st.setInt(2, obj.getId());
			
			st.executeUpdate();
			
		}catch(SQLException e){
			e.getMessage();
		}
		finally {
			DB.closeStatement(st);
		}
	}

	@Override
	public void deleteById(Integer id) {
		PreparedStatement st = null;
		try {
			st = conn.prepareStatement(
					"DELETE FROM pais "
					+ "WHERE pais_id = ?"
					);
			st.setInt(1, id);
			st.executeUpdate();
		}
		catch(SQLException e) {
			throw new DbException(e.getMessage());
		}
		finally {
			DB.closeStatement(st);
		}
		
	}

	@Override
	public Pais findById(Integer id) {
		PreparedStatement st = null;
		ResultSet rs = null;
		try {
			st = conn.prepareStatement("SELECT  * FROM PAIS " + "WHERE pais_id = ?");
			st.setInt(1, id);
			rs = st.executeQuery();
			if (rs.next()) {
				Pais obj = instantiatePais(rs);
				return obj;
			}
			return null;
		} catch (SQLException e) {
			throw new DbException(e.getMessage());
		}
	}

	private Pais instantiatePais(ResultSet rs) throws SQLException {
		Pais pais = new Pais();
		pais.setId(rs.getInt("pais_id"));
		pais.setNome(rs.getString("nome"));
		return pais;
	}

	@Override
	public List<Pais> findAll() {
		PreparedStatement st = null;
		ResultSet rs = null;
		try {
			st = conn.prepareStatement("SELECT  * FROM PAIS ");
			rs = st.executeQuery();

			List<Pais> list = new ArrayList<>();

			while (rs.next()) {
				Pais obj = instantiatePais(rs);
				list.add(obj);
			}
			return list;
		} catch (SQLException e) {
			throw new DbException(e.getMessage());
		}
	}

}