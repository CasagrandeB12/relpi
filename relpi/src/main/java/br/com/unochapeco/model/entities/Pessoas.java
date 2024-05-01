package br.com.unochapeco.model.entities;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "pessoas")
public class Pessoas implements Serializable{

	private static final long serialVersionUID = 1L;

	private Integer id;
	private Integer status;
	private String nome;
	private Integer cpf;
	private Integer rg;
	private String genero;
	private Date dataNascimento;
	private String email;
	private Integer telefone;
	private Endereco endereco;
	
	public Pessoas() {
	}

	public Pessoas(Integer id, Integer status, String nome, Integer cpf, Integer rg, String genero, Date dataNascimento,
			String email, Integer telefone, Endereco endereco) {
		super();
		this.id = id;
		this.status = status;
		this.nome = nome;
		this.cpf = cpf;
		this.rg = rg;
		this.genero = genero;
		this.dataNascimento = dataNascimento;
		this.email = email;
		this.telefone = telefone;
		this.endereco = endereco;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public Integer getCpf() {
		return cpf;
	}

	public void setCpf(Integer cpf) {
		this.cpf = cpf;
	}

	public Integer getRg() {
		return rg;
	}

	public void setRg(Integer rg) {
		this.rg = rg;
	}

	public String getGenero() {
		return genero;
	}

	public void setGenero(String genero) {
		this.genero = genero;
	}

	public Date getDataNascimento() {
		return dataNascimento;
	}

	public void setDataNascimento(Date dataNascimento) {
		this.dataNascimento = dataNascimento;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Integer getTelefone() {
		return telefone;
	}

	public void setTelefone(Integer telefone) {
		this.telefone = telefone;
	}

	public Endereco getEndereco() {
		return endereco;
	}

	public void setEndereco(Endereco endereco) {
		this.endereco = endereco;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Pessoas other = (Pessoas) obj;
		return Objects.equals(id, other.id);
	}
}
