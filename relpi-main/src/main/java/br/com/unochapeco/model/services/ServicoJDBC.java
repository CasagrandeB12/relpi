package br.com.unochapeco.model.services;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import br.com.unochapeco.model.dao.ServicoDao;
import br.com.unochapeco.model.entities.Servico;
import br.com.unochapeco.model.entities.TipoServico;
import br.com.unochapeco.relpi.controller.db.DB;
import br.com.unochapeco.relpi.controller.db.DbException;

public class ServicoJDBC implements ServicoDao{

	private Connection conn;
	
	public ServicoJDBC(Connection conn) {
		this.conn = conn;
	}
	
	@Override
	public void insert(Servico obj) {
		PreparedStatement st = null;
		try {
			st = conn.prepareStatement(
					"INSERT INTO servico "
					+ "(SERVICO_ID, NOME, DESCRICAO, TIPOSERVICO_ID) "
					+ "VALUES "
					+ "(?, ?, ?, ?)",
					Statement.RETURN_GENERATED_KEYS);
			
			st.setInt(1, obj.getId());
			st.setString(2, obj.getNome());
			st.setString(3, obj.getDescricao());
			
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
	public void update(Servico obj, Integer id) {
		PreparedStatement st = null;
		try {
			st = conn.prepareStatement(
					"UPDATE servico"
					+ " SET nome = ?, descricao = ?"
					+ " where servico_id = ?",
					Statement.RETURN_GENERATED_KEYS);
			
			st.setString(1, obj.getNome());
			st.setString(2, obj.getDescricao());
			st.setInt(3, obj.getId());
			
			st.executeUpdate();
			
		}catch(Exception e){
			e.getMessage();
		}finally {
			DB.closeStatement(st);
		}
	}

	@Override
	public void deleteById(Integer id) {
		PreparedStatement st = null;
		try {
			st = conn.prepareStatement(
					"DELETE FROM SERVICO "
					+ "WHERE SERVICO_id = ?"
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
	public Servico findById(Integer id) {
		PreparedStatement st = null;
		ResultSet rs = null;
		try {
			st = conn.prepareStatement(
					"SELECT S.SERVICO_ID, S.NOME, S.DESCRICAO, ts.TIPOSERVICO_ID, ts.NOME as tiposervico_nome "
					+ "FROM SERVICO S " 
					+ "INNER JOIN TIPO_SERVICO ts " 
					+ "ON ts.TIPOSERVICO_ID = S.TIPOSERVICO_ID "
					+ "WHERE s.SERVICO_ID = ? ");
			st.setInt(1, id);
			rs = st.executeQuery();

			if(rs.next()) {
				TipoServico tipoServico = new TipoServico();
				tipoServico.setId(rs.getInt("tiposervico_id"));
				tipoServico.setNome(rs.getString("tiposervico_nome"));
				
				Servico servico = new Servico();
				servico.setId(rs.getInt("servico_id"));
				servico.setNome(rs.getString("nome"));
				servico.setDescricao(rs.getString("descricao"));
				servico.setTipoServico(tipoServico);
				return servico;
			}
			return null;
		}catch(SQLException e) {
			throw new DbException(e.getMessage());
		}finally {
			DB.closeStatement(st);
			DB.closeResultSet(rs);
		}
	}

	@Override
	public List<Servico> findAll() {
		PreparedStatement st = null;
		ResultSet rs = null;
		try {
			st = conn.prepareStatement("SELECT s.SERVICO_ID as servico_id ,s.NOME as nome, s.DESCRICAO as descricao,"
					+ " ts.TIPOSERVICO_ID as tiposervico_id, ts.NOME as tiposervico_nome"
					+ " FROM SERVICO s INNER JOIN TIPO_SERVICO ts"
					+ " ON s.TIPOSERVICO_ID = ts.TIPOSERVICO_ID"
					+ " ORDER BY s.NOME");
			rs = st.executeQuery();

			List<Servico> list = new ArrayList<>();
			Map <Integer, TipoServico> map = new HashMap<>();
			
			while (rs.next()) {

				TipoServico tipoServico = map.get(rs.getInt("tiposervico_id"));
			
				if(tipoServico == null) {
					tipoServico = instantiateTipoServico(rs);
					map.put(rs.getInt("tiposervico_id"), tipoServico);
				}

				Servico obj = instantiateServico(rs, tipoServico);
				list.add(obj);
			}
			return list;
		} catch (SQLException e) {
			throw new DbException(e.getMessage());
		}
	}

	private TipoServico instantiateTipoServico(ResultSet rs) throws SQLException {
		TipoServico tipoServico = new TipoServico();
		tipoServico.setId(rs.getInt("tiposervico_id"));
		tipoServico.setNome(rs.getString("tiposervico_nome"));		
		return tipoServico;
	}
	
	private Servico instantiateServico(ResultSet rs, TipoServico tipoServico) throws SQLException {
		Servico servico = new Servico();
		servico.setId(rs.getInt("servico_id"));
		servico.setNome(rs.getString("nome"));
		servico.setDescricao(rs.getString("descricao"));
		servico.setTipoServico(tipoServico);
		return servico;
	}
}
