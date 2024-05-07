package br.com.unochapeco.model.dao;

import br.com.unochapeco.model.services.ServicoJDBC;
import br.com.unochapeco.relpi.controller.db.DB;

public class ServicoDaoFactory {

	public static ServicoDao createServicoDao() {
		return new ServicoJDBC(DB.getConnection());
	}
}