package br.com.unochapeco.model.dao;

import br.com.unochapeco.model.services.PessoasJDBC;
import br.com.unochapeco.relpi.controller.db.DB;

public class PessoasDaoFactory {

	public static PessoasDao createPessoasDao() {
		return new PessoasJDBC(DB.getConnection());
	}
}
