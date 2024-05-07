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

import br.com.unochapeco.model.dao.PessoasDao;
import br.com.unochapeco.model.entities.Endereco;
import br.com.unochapeco.model.entities.Pessoas;
import br.com.unochapeco.relpi.controller.db.DB;
import br.com.unochapeco.relpi.controller.db.DbException;

public class PessoasJDBC implements PessoasDao{

	
	private Connection conn;

	public PessoasJDBC(Connection conn) {
		this.conn = conn;
	}

	@Override
	public void insert(Pessoas obj) {
		PreparedStatement st = null;
		try {
			st = conn.prepareStatement(
					"INSERT INTO PESSOAS"
					+ " (PESSOA_ID, STATUS, NOME, CPF, RG, GENERO, DATA_NASCIMENTO, EMAIL, TELEFONE, ENDERECO_ID)"
					+ " VALUES"
					+ " (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
					Statement.RETURN_GENERATED_KEYS);
			
					st.setInt(1, obj.getId());
					st.setInt(2, obj.getStatus());
					st.setString(3, obj.getNome());
					st.setLong(4, obj.getCpf());
					st.setInt(5, obj.getRg());
					st.setString(6, obj.getGenero());
					st.setDate(7, new java.sql.Date(obj.getDataNascimento().getTime()));
					st.setString(8, obj.getEmail());
					st.setLong(9, obj.getTelefone());
					st.setInt(10, obj.getEndereco().getId());
					
					int rowsAffected = st.executeUpdate();
					if(rowsAffected > 0) {
						ResultSet rs = st.getGeneratedKeys();
						if(rs.next()) {
							int id = rs.getInt(1);
							obj.setId(id);
						}
						DB.closeResultSet(rs);
					}
					else {
						throw new DbException("Erro inesperado, nenhuma linha foi alterada!");
					}
		}catch(SQLException e) {
			e.getMessage();
		}
		finally {
			DB.closeStatement(st);
		}
	}

	@Override
	public void update(Pessoas obj, Integer id) {
		PreparedStatement st = null;
		try {
			st = conn.prepareStatement(
					"UPDATE PESSOAS"
					+ " SET status = ?, nome = ?, genero = ?, endereco_id = ?, email = ?, telefone = ?"
					+ " WHERE pessoa_id = ?",
					Statement.RETURN_GENERATED_KEYS);
			
			st.setInt(1, obj.getStatus());
			st.setString(2, obj.getNome());
			st.setString(3, obj.getGenero());
			st.setInt(4, obj.getEndereco().getId());
			st.setString(5, obj.getEmail());
			st.setLong(6, obj.getTelefone());
			st.setInt(7, id);
			
			st.executeUpdate();
		}catch(SQLException e) {
			throw new DbException(e.getMessage());
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
					"DELETE FROM pessoas"
					+ " WHERE pessoa_id = ?");
			
			st.setInt(1, id);
			st.executeUpdate();
		}catch(SQLException e) {
			throw new DbException(e.getMessage());
		}
		finally {
			DB.closeStatement(st);
		}
	}

	@Override
	public Pessoas findById(Integer id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Pessoas> findAll() {
		PreparedStatement st = null;
		ResultSet rs = null;
		try {
			st = conn.prepareStatement(
					"SELECT p.PESSOA_ID, p.STATUS AS status_pessoa, p.NOME AS nome_pessoa, p.CPF, p.RG, p.genero, p.DATA_NASCIMENTO, p.EMAIL, p.TELEFONE,"
					+ " e.ENDERECO_ID, e.status, e.NOME, e.NUMERO"
					+ " FROM PESSOAS p INNER JOIN ENDERECO e"
					+ " on p.ENDERECO_ID = e.ENDERECO_ID");
			rs = st.executeQuery();
			
			List<Pessoas> list = new ArrayList<>();
			Map<Integer, Endereco> map = new HashMap<>();
			
			while (rs.next()) {
				Endereco endereco = map.get(rs.getInt("endereco_id"));
				
				if(endereco == null) {
					endereco = instantiateEndereco(rs);
					map.put(rs.getInt("endereco_id"), endereco);
				}
				
				Pessoas obj = instantiatePessoas(rs, endereco);
				list.add(obj);
			}
			return list;
		}catch (SQLException e) {
			throw new DbException(e.getMessage());
		}
		finally {
			DB.closeStatement(st);
			DB.closeResultSet(rs);
		}
	}
	
	private Endereco instantiateEndereco(ResultSet rs) throws SQLException {
		Endereco endereco = new Endereco();
		endereco.setId(rs.getInt("endereco_id"));
		endereco.setStatus(rs.getInt("status"));
		endereco.setNome(rs.getString("nome"));	
		endereco.setNumero(rs.getInt("numero"));
		//endereco.setBairro(bairro.setId("bairro"));;
		return endereco;
	}
	

	private Pessoas instantiatePessoas(ResultSet rs, Endereco endereco ) throws SQLException{
		Pessoas pessoas = new Pessoas();
		pessoas.setId(rs.getInt("pessoa_id"));
		pessoas.setStatus(rs.getInt("status_pessoa"));
		pessoas.setNome(rs.getString("nome_pessoa"));
		pessoas.setCpf(rs.getLong("cpf"));
		pessoas.setRg(rs.getInt("rg"));
		pessoas.setGenero(rs.getString("genero"));
		pessoas.setTelefone(rs.getLong("telefone"));
		pessoas.setEmail(rs.getString("email"));
		pessoas.setDataNascimento(rs.getDate("data_nascimento"));
		pessoas.setEndereco(endereco);
		return pessoas;
	}
	
}
