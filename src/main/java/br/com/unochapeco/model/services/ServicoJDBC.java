package br.com.unochapeco.model.services;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import br.com.unochapeco.model.dao.ServicoDao;
import br.com.unochapeco.model.entities.Servico;
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
			st.setInt(4, obj.getIdTipoServico());
			
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
		// TODO Auto-generated method stub
		
	}

	@Override
	public void deleteById(Integer id) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public Servico findById(Integer id) {
		// TODO Auto-generated method stub
		return null;
	}

	private Servico instantiateServico(ResultSet rs) throws SQLException {
		Servico servico = new Servico();
		servico.setId(rs.getInt("servico_id"));
		servico.setNome(rs.getString("nome"));
		servico.setDescricao(rs.getString("descricao"));
		servico.setIdTipoServico(rs.getInt("tiposervico_id"));
		return servico;
	}
	
	@Override
	public List<Servico> findAll() {
		PreparedStatement st = null;
		ResultSet rs = null;
		try {
			st = conn.prepareStatement("SELECT * FROM SERVICO");
			rs = st.executeQuery();

			List<Servico> list = new ArrayList<>();

			while (rs.next()) {
				Servico obj = instantiateServico(rs);
				list.add(obj);
			}
			return list;
		} catch (SQLException e) {
			throw new DbException(e.getMessage());
		}
	}

	
}
