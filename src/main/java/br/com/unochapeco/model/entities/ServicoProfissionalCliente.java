package br.com.unochapeco.model.entities;

import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "servico_profissional_cliente")
public class ServicoProfissionalCliente {

	private Integer id;
	private Cliente cliente;
	private Profissional profissional;
	private Servico servico;
	
	public ServicoProfissionalCliente() {
	}

	public ServicoProfissionalCliente(Integer id, Cliente cliente, Profissional profissional, Servico servico) {
		super();
		this.id = id;
		this.cliente = cliente;
		this.profissional = profissional;
		this.servico = servico;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Cliente getCliente() {
		return cliente;
	}

	public void setCliente(Cliente cliente) {
		this.cliente = cliente;
	}

	public Profissional getProfissional() {
		return profissional;
	}

	public void setProfissional(Profissional profissional) {
		this.profissional = profissional;
	}

	public Servico getServico() {
		return servico;
	}

	public void setServico(Servico servico) {
		this.servico = servico;
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
		ServicoProfissionalCliente other = (ServicoProfissionalCliente) obj;
		return Objects.equals(id, other.id);
	}
}
