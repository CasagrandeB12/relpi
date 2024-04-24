package br.com.unochapeco.model.services;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import br.com.unochapeco.model.dao.TipoServicoDao;
import br.com.unochapeco.model.entities.TipoServico;
import br.com.unochapeco.relpi.controller.db.DB;
import br.com.unochapeco.relpi.controller.db.DbException;

@Repository
public class TipoServicoJDBC implements TipoServicoDao {

	private Connection conn;

	public TipoServicoJDBC(Connection conn) {
		this.conn = conn;
	}

	@Override
	public void insert(TipoServico obj) {
		PreparedStatement st = null;
		try {
			st = conn.prepareStatement(
					"INSERT INTO tipo_servico "
					+ "(TIPOSERVICO_ID, NOME) "
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
	public void update(TipoServico obj, Integer id) {
		PreparedStatement st = null;
		try {
			st = conn.prepareStatement(
					"UPDATE TIPO_SERVICO " 
					+ "SET NOME = ? "
					+ "WHERE tiposervico_id = ?",
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
					"DELETE FROM TIPO_SERVICO "
					+ "WHERE TIPOSERVICO_id = ?"
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
	public TipoServico findById(Integer id) {
		PreparedStatement st = null;
		ResultSet rs = null;
		try {
			st = conn.prepareStatement("SELECT  * FROM TIPO_SERVICO " 
										+ "WHERE TIPOSERVICO_id = ?");
			st.setInt(1, id);
			rs = st.executeQuery();
			if (rs.next()) {
				TipoServico obj = instantiateTipoServico(rs);
				return obj;
			}
			return null;
		} catch (SQLException e) {
			throw new DbException(e.getMessage());
		}
	}
	
	public TipoServico instantiateTipoServico(ResultSet rs) throws SQLException {
		TipoServico tipoServico = new TipoServico();
		tipoServico.setId(rs.getInt("tiposervico_id"));
		tipoServico.setNome(rs.getString("nome"));
		return tipoServico;
	}

	@Override
	public List<TipoServico> findAll() {
		PreparedStatement st = null;
		ResultSet rs = null;
		try {
			st = conn.prepareStatement("SELECT  * FROM TIPO_SERVICO ORDER BY TIPOSERVICO_ID  ");
			rs = st.executeQuery();

			List<TipoServico> list = new ArrayList<>();

			while (rs.next()) {
				TipoServico obj = instantiateTipoServico(rs);
				list.add(obj);
			}
			return list;
		} catch (SQLException e) {
			throw new DbException(e.getMessage());
		}
	}

}